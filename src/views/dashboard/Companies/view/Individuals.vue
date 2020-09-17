<template>
  <base-material-card
    color="primary"
    :title="companyName ? `${companyName} - Individuals` : 'Individuals'"
  >
    <v-progress-linear
      v-if="!!loading"
      indeterminate
    />
    <v-row align="end">
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        class="ml-auto"
        label="Search"
        hide-details
        single-line
        clearable
        style="max-width: 250px;"
        :disabled="!isViewMode"
      />
      <template
        v-if="role && checkCUD(role.id)"
      >
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
      </template>
    </v-row>

    <user-table-editor
      v-if="!isViewMode"
      :user-data="users"
      :min-dimensions="[9, options.itemsPerPage]"
      :updated-status="updatedStatus"
      @change:content-changed="() => { notSaved = true}"
      @change:save-update="handleAfterSave"
    />
    <v-data-table
      v-if="isViewMode"
      :headers="headers"
      :items="users"
      :options.sync="options"
      :hide-default-footer="true"
      class="mt-5"
    >
      <template v-slot:item="user">
        <tr>
          <td class="pl-5">
            <v-badge
              slot="activator"
              left
              :color="user.item.response===1 ? 'success' : 'error'"
            >
              <template v-slot:badge>
                <v-tooltip right>
                  <template v-slot:activator="{ on }">
                    <v-icon
                      dark
                      v-on="on"
                    >
                      {{ user.item.response===1 ? 'mdi-badge-account' : 'mdi-badge-account-alert' }}
                    </v-icon>
                  </template>
                  {{ user.item.response===1 ? 'Responder' : 'No Responder' }}
                </v-tooltip>
              </template>
              <router-link
                class="table-link"
                :to="'/individuals/' + user.item.id"
              >
                {{ user.item.name | truncate(39) }}
              </router-link>
            </v-badge>
          </td>
          <td>
            <router-link
              v-if="user.item.primary_company_id"
              class="table-link"
              :to="'/companies/' + user.item.primary_company_id"
            >
              {{ getCompanyNameFromId(user.item.primary_company_id) }}
            </router-link>
          </td>
          <td>
            {{ user.item.email }}
          </td>
          <td>
            {{ user.item.mobile_number }}
          </td>
          <td>
            <v-speed-dial
              v-model="fab[user.item.id]"
              direction="left"
            >
              <template v-slot:activator>
                <v-btn
                  v-model="fab[user.item.id]"
                  fab
                  small
                  color="primary"
                >
                  <v-icon v-if="fab[user.item.id]">
                    mdi-close
                  </v-icon>
                  <v-icon v-else>
                    mdi-chevron-left
                  </v-icon>
                </v-btn>
              </template>
              <v-btn
                fab
                x-small
                color="primary"
                :to="`/individuals/${user.item.id}`"
              >
                <v-icon>mdi-eye</v-icon>
              </v-btn>
              <v-btn
                fab
                x-small
                color="error"
                @click="deleteMsg = true, userToDelete = user.item"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-speed-dial>
          </td>
        </tr>
      </template>
    </v-data-table>
    <table-footer
      v-if="options.itemsPerPage > 0"
      :options="options"
      :total="total"
      :company="true"
    />
    <v-dialog
      v-model="deleteMsg"
      persistent
      max-width="600"
    >
      <v-card>
        <v-card-title class="headline">
          You are about to delete or unlink an individual
        </v-card-title>
        <v-card-text>
          Please confirm that you would like to delete or unlink the following individual: <b>{{ userToDelete.name }}</b>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="warning"
            text
            @click="removeLink(userToDelete.id)"
          >
            Remove Link
          </v-btn>
          <v-btn
            color="error"
            text
            @click="deleteUser(userToDelete.id)"
          >
            Delete User
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="deleteMsg = false"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- add individual dialog -->
    <v-dialog
      v-model="showAdd"
      max-width="700"
      @click:outside="closeAdd"
      @keydown.esc="closeAdd"
    >
      <add-individual
        :counter="addCounter"
        :company="$route.params.id"
        @complete="completeAdd"
      />
    </v-dialog>
    <confirm-dialog
      :show="saveChanges"
      :text="confirmText"
      @close:dialog="() => { saveChanges = false }"
      @discard:changes="() => { discardChanges() }"
    />
  </base-material-card>
</template>

<script>
  import axios from 'axios'
  import { mapActions, mapState } from 'vuex'
  import { companyItemsDownload } from '@/mixins/menuItemsDownload/companyItemsDownload'
  import { checkCUD } from '@/shared/management'

  export default {
    components: {
      UserTableEditor: () => import('../../components/bulkEditors/UserTableEditor'),
      TableFooter: () => import('../../components/TableFooter'),
      AddIndividual: () => import('../../components/forms/AddIndividual'),
      ConfirmDialog: () => import('../../components/ConfirmDialog.vue'),
    },
    mixins: [
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
          text: 'Email',
          value: 'email',
        },
        {
          text: 'Mobile Number',
          value: 'mobile_number',
        },
        {
          text: 'Actions',
          value: 'actions',
        },
      ],
      users: [],
      loading: 0,
      options: {},
      staticSearch: {
        active: -1,
        companies: [],
        role: 0,
        resource_provider: -1,
      },
      total: 0,
      searchTimeout: null,
      companyName: '',
      deleteMsg: false,
      userToDelete: {
        id: -1,
        name: '',
      },
      fab: {},
      isViewMode: true,
      updatedStatus: 0,
      showAdd: false,
      addCounter: 0,
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
    },
    async mounted () {
      this.staticSearch.companies = [this.$route.params.id]
      axios.get(`companies/${this.$route.params.id}`)
        .then(res => {
          this.companyName = res.data.data[0].name
        })
      await this.getDataFromApi()
    },
    methods: {
      ...mapActions({
        showSnackBar: 'showSnackBar',
      }),
      async getDataFromApi () {
        this.loading++
        const { sortBy, sortDesc, page, itemsPerPage } = this.options
        try {
          // if have preivous call, cancel it
          if (this.call) {
            this.call.cancel()
            this.loading--
          }

          // create a new call
          this.call = axios.CancelToken.source()

          if (this.search) {
            const res = await axios.post(
              `users?query=${this.search.replace('&', '%26')}&page=${page}&per_page=${itemsPerPage}`,
              { staticSearch: this.staticSearch },
              { cancelToken: this.call.token },
            )
            this.users = res.data.data
            this.total = res.data.meta.total
          }
          if (sortBy[0] && !this.search) {
            const direction = sortDesc[0] ? 'desc' : 'asc'
            const res = await axios.post(
              `users?direction=${direction}&sortBy=${sortBy[0]}&page=${page}&per_page=${itemsPerPage}`,
              { staticSearch: this.staticSearch },
              { cancelToken: this.call.token },
            )
            this.users = res.data.data
            this.total = res.data.meta.total
          }
          if (!this.search && !sortBy[0]) {
            const res = await axios.post(
              `users?page=${page}&per_page=${itemsPerPage}`,
              { staticSearch: this.staticSearch },
              { cancelToken: this.call.token },
            )
            this.users = res.data.data
            this.total = res.data.meta.total
          }
          this.call = null
          this.loading--
        } catch (error) {
          if (!axios.isCancel(error)) {
            this.showSnackBar({ text: error, color: 'error' })
          }
        }
      },
      removeLink (id) {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        axios.get('companies/' + id + '/unlinkUsers')
          .then(res => {
            this.deleteMsg = false
            this.showSnackBar({ text: res.data.message, color: 'success' })
            this.getDataFromApi()
          })
      },
      deleteUser (id) {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        axios.delete('users/' + id + '/destroy')
          .then(res => {
            this.deleteMsg = false
            this.showSnackBar({ text: res.data.message, color: 'success' })
            this.getDataFromApi()
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
          this.loading++
          this.updatedStatus = 1
        }
      },
      handleAfterSave (updatedCount, errCount) {
        this.notSaved = false
        this.isViewMode = true
        this.loading--
        this.updatedStatus = 0
        if (errCount > 0) {
          this.showSnackBar({ text: `${errCount} update${errCount > 1 ? 's' : ''} failed`, color: 'error' })
        }
        if (updatedCount > 0) {
          this.showSnackBar({ text: `${updatedCount} user${updatedCount > 1 ? 's' : ''} updated`, color: 'success' })
        }
      },

      getCompanyNameFromId (companyId) {
        return (this.companyItems.find(company =>
          company.id === companyId,
        ) || {}).name || ''
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
