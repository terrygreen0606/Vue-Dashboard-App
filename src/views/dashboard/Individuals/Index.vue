<template>
  <v-container
    fluid
    tag="section"
  >
    <input
      ref="file"
      type="file"
      class="d-none"
      @change="uploadUserCsv"
    >
    <base-material-card
      color="primary"
      icon="mdi-account-group"
      inline
    >
      <template v-slot:after-heading>
        <div class="display-2">
          Individuals
        </div>
      </template>

      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            hide-details
            class="ma-0 pa-0"
            clearable
            :disabled="!isViewMode"
          />
        </v-col>
        <v-col
          v-if="role && checkCUD(role.id)"
          cols="12"
          md="6"
          class="d-flex justify-space-around align-center"
        >
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                :disabled="!isViewMode"
                icon
                color="primary"
                small
                class="mr-2"
                v-on="on"
                @click="advancedSearch = !advancedSearch"
              >
                <v-icon size="28">
                  mdi-table-search
                </v-icon>
              </v-btn>
            </template>
            <span>Advanced Search</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                :disabled="!isViewMode"
                icon
                color="warning"
                small
                class="mr-2"
                v-on="on"
                @click="addIndividual"
              >
                <v-icon size="28">
                  mdi-plus-circle-outline
                </v-icon>
              </v-btn>
            </template>
            <span>Add Individual</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                :disabled="!isViewMode"
                icon
                color="error"
                small
                class="mr-3"
                v-on="on"
                @click="$refs.file.click()"
              >
                <v-icon size="28">
                  mdi-upload
                </v-icon>
              </v-btn>
            </template>
            <span>Upload Individuals</span>
          </v-tooltip>
          <v-tooltip
            v-if="!$store.state.sidebar.isMobile"
            bottom
            z-index="9999"
          >
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                small
                class="mr-2"
                v-on="on"
                @click="editOrSave"
              >
                <v-icon
                  size="28"
                  color="primary"
                >
                  {{ `${ isViewMode ? 'mdi-pencil' : 'mdi-content-save' }` }}
                </v-icon>
              </v-btn>
            </template>
            <span>{{ `${ isViewMode ? 'Edit Users' : 'Save Users'}` }}</span>
          </v-tooltip>
        </v-col>
      </v-row>

      <v-row v-if="advancedSearch && role && checkCUD(role.id)">
        <v-col
          cols="12"
          class="display-2"
        >
          Advanced Search
        </v-col>
        <v-col
          cols="12"
          sm="3"
        >
          <v-select
            v-model="staticSearch.active"
            :items="$store.state.menuitems.statusItems"
            item-text="text"
            item-value="value"
            label="Status"
            prepend-icon="mdi-check"
          />
        </v-col>
        <v-col
          cols="12"
          sm="3"
        >
          <v-select
            v-model="staticSearch.resource_provider"
            :items="$store.state.menuitems.resourceProviderItems"
            item-text="text"
            item-value="value"
            label="Resource Provider"
            prepend-icon="mdi-hard-hat"
          />
        </v-col>
        <v-col
          cols="12"
          sm="3"
        >
          <v-autocomplete
            v-model="staticSearch.companies"
            :items="companyItems"
            item-text="name"
            item-value="id"
            label="Companies"
            prepend-icon="mdi-domain"
            multiple
            clearable
          />
        </v-col>
        <v-col
          cols="12"
          sm="3"
        >
          <v-select
            v-model="staticSearch.role"
            :items="roleItems"
            item-text="name"
            item-value="id"
            label="Role"
            prepend-icon="mdi-account-lock"
            clearable
          />
        </v-col>
      </v-row>

      <user-table-editor
        v-if="!isViewMode"
        :user-data="individuals"
        :min-dimensions="[9, options.itemsPerPage]"
        :updated-status="updatedStatus"
        @change:content-changed="() => { notSaved = true}"
        @change:save-update="handleAfterSave"
      />
      <v-data-table
        v-if="isViewMode"
        :headers="headers"
        :items="individuals"
        :options.sync="options"
        :loading="!!loading"
        :hide-default-footer="true"
        class="mt-5"
      >
        <template v-slot:item="individual">
          <tr>
            <td class="pl-5">
              <router-link
                class="table-link"
                :to="'/individuals/' + individual.item.id"
              >
                {{ individual.item.name | truncate(42) }}
              </router-link>
            </td>
            <td class="d-none d-sm-table-cell">
              <router-link
                v-if="individual.item.primary_company_id"
                class="table-link"
                :to="'/companies/' + individual.item.primary_company_id"
              >
                {{ getCompanyNameFromId(individual.item.primary_company_id) | truncate(42) }}
              </router-link>
            </td>
            <td>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <span
                    dark
                    v-on="on"
                  >
                    <v-badge
                      slot="activator"
                      bottom
                      bordered
                      overlap
                      :color="individual.item.networks_active===1 ? 'orange' : 'secondary'"
                      :value="individual.item.networks_active===1 || individual.item.capabilies_active===1"
                    >
                      <template v-slot:badge>
                        <v-icon
                          v-if="individual.item.networks_active===1"
                          dark
                        >
                          mdi-star
                        </v-icon>
                        <v-icon
                          v-else-if="individual.item.capabilies_active===1"
                        >
                          mdi-hard-hat
                        </v-icon>
                      </template>
                      <span>
                        <v-icon
                          v-if="individual.item.active"
                          color="success"
                          size="30"
                        >
                          mdi-shield-account
                        </v-icon>
                        <v-icon
                          v-else
                          color="error"
                          size="30"
                        >
                          mdi-shield-account
                        </v-icon>
                      </span>
                    </v-badge>
                  </span>
                </template>
                <span v-if="individual.item.active">Active</span>
                <span v-else>Not Active</span>
              </v-tooltip>
            </td>
            <td class="d-none d-sm-table-cell">
              {{ individual.item.email }}
            </td>
            <td>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <a
                    :href="`tel:${individual.item.mobile_number}`"
                    class="click-to-call"
                    v-on="on"
                  >
                    {{ individual.item.mobile_number }}
                  </a>
                </template>
                <span>Click to call</span>
              </v-tooltip>
            </td>
          </tr>
        </template>
      </v-data-table>
      <table-footer
        :options="options"
        :total="total"
      />
    </base-material-card>
    <v-dialog
      v-model="showAdd"
      max-width="700"
      @click:outside="closeAdd"
      @keydown.esc="closeAdd"
    >
      <add-individual
        :counter="addCounter"
        @complete="completeAdd"
      />
    </v-dialog>
    <confirm-dialog
      :show="saveChanges"
      :text="confirmText"
      @close:dialog="() => { saveChanges = false }"
      @discard:changes="() => { discardChanges() }"
    />
  </v-container>
</template>

<script>
  import axios from 'axios'
  import { mapActions, mapState } from 'vuex'
  import { roleItemsDownload } from '@/mixins/menuItemsDownload/roleItemsDownload'
  import { companyItemsDownload } from '@/mixins/menuItemsDownload/companyItemsDownload'
  import { checkCUD } from '@/shared/management'

  export default {
    components: {
      UserTableEditor: () => import('../components/bulkEditors/UserTableEditor'),
      TableFooter: () => import('../components/TableFooter'),
      AddIndividual: () => import('../components/forms/AddIndividual'),
      ConfirmDialog: () => import('../components/ConfirmDialog.vue'),
    },
    mixins: [
      roleItemsDownload,
      companyItemsDownload,
    ],
    data: () => ({
      search: '',
      headers: [
        {
          text: 'Name',
          value: 'name',
        },
        {
          text: 'Company',
          value: 'company',
        },
        {
          text: 'Status',
          value: 'status',
        },
        {
          text: 'Email',
          value: 'email',
        },
        {
          text: 'Mobile Number',
          value: 'mobile_number',
        },
      ],
      staticSearch: {
        active: -1,
        companies: [],
        role: 0,
        resource_provider: -1,
      },
      individuals: [],
      total: 0,
      options: {},
      loading: 0,
      searchTimeout: null,
      advancedSearch: false,
      showAdd: false,
      addCounter: 0,
      isViewMode: true,
      updatedStatus: 0,
      call: null, // used to stop previous axios request
      checkCUD,
      saveChanges: false,
      confirmText: 'If you continue, your progress will be lost.\n Do you want to leave this page without saving?',
      to: null,
      next: null,
      notSaved: false,
    }),
    computed: {
      ...mapState({
        role: state => state.authentication.role,
      }),
    },
    watch: {
      options: {
        handler () {
          this.getDataFromApi()
        },
        deep: true,
      },
      search () {
        if (this.searchTimeout) {
          clearTimeout(this.searchTimeout)
        }
        this.searchTimeout = setTimeout(() => {
          this.options.page = 1
          this.getDataFromApi()
        }, 500)
      },
      staticSearch: {
        handler () {
          this.options.page = 1
          this.getDataFromApi()
        },
        deep: true,
      },
    },
    mounted () {
      // this.getDataFromApi()
    },
    methods: {
      ...mapActions({
        showSnackBar: 'showSnackBar',
      }),
      async getDataFromApi () {
        // if have preivous call, cancel it
        if (this.call) {
          this.call.cancel()
        }

        this.loading++
        const { sortBy, sortDesc, page, itemsPerPage } = this.options
        try {
          let apiurl = `users?page=${page}&per_page=${itemsPerPage}`
          if (this.search) {
            apiurl += `&query=${this.search.replace('&', '%26')}`
          } else if (sortBy[0] && sortBy[0].length > 0) {
            const direction = sortDesc[0] ? 'desc' : 'asc'
            apiurl += `&direction=${direction}&sortBy=${sortBy[0]}`
          }

          // create a new call
          this.call = axios.CancelToken.source()

          const res = await axios.post(
            apiurl,
            { staticSearch: this.staticSearch },
            { cancelToken: this.call.token },
          )
          this.individuals = res.data.data
          this.total = res.data.meta ? res.data.meta.total : res.data.total
        } catch (error) {
          if (!axios.isCancel(error)) {
            this.showSnackBar({ text: error, color: 'error' })
          }
        }
        this.loading--
        this.call = null
      },
      uploadUserCsv (event) {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        const formData = new FormData()
        formData.append('file', event.target.files[0])
        axios.post(
          'users/upload/bulkCsv',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        ).then(res => {
          this.showSnackBar({ text: res.data.message, color: 'success' })
          this.getDataFromApi()
        }).catch(error => {
          this.showSnackBar({ text: error.response.data.message || error.response.statusText, color: 'error' })
          this.getDataFromApi()
        })
      },
      addIndividual () {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        this.showAdd = true
        this.addCounter++
      },
      completeAdd (success) {
        this.showAdd = false
        if (success) {
          this.getDataFromApi()
        }
      },
      closeAdd () {
        this.$confirm('Do you want to lose your progress?', { title: 'Warning' })
          .then(res => {
            if (!res) {
              this.showAdd = true
            }
          })
      },
      editOrSave () {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        if (this.isViewMode) {
          this.notSaved = true
          this.isViewMode = !this.isViewMode
          this.updatedStatus = -1
        } else {
          this.updatedStatus = 1
        }
      },
      handleAfterSave (updatedCount, errCount) {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        this.notSaved = false
        this.isViewMode = true
        this.updatedStatus = 0
        if (errCount > 0) {
          this.showSnackBar({ text: `${errCount} update${errCount > 1 ? 's' : ''} failed`, color: 'error' })
        }
        if (updatedCount > 0) {
          this.showSnackBar({ text: `${updatedCount} user${updatedCount > 1 ? 's' : ''} updated`, color: 'success' })
        }
      },

      getCompanyNameFromId (companyId) {
        return (this.$store.state.menuitems.companyItems.find(company =>
          company.id === companyId,
        ) || {}).name || ''
      },
      discardChanges () {
        this.saveChanges = false
        this.next()
      },
    },
    beforeRouteLeave (to, from, next) {
      if (!this.notSaved) {
        next()
      } else {
        this.saveChanges = true
        this.to = to
        this.next = next
      }
    },
  }
</script>

<style lang="sass" scoped>
  .click-to-call
    text-decoration: none
</style>
