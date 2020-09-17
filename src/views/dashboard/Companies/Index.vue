<template>
  <v-container
    id="companies-index"
    fluid
    tag="section"
  >
    <input
      ref="file"
      type="file"
      class="d-none"
      @change="uploadCompanyCsv"
    >
    <base-material-card
      color="primary"
      icon="mdi-domain"
      inline
    >
      <template v-slot:after-heading>
        <div class="display-2">
          Companies
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
          <v-tooltip
            bottom
          >
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
          <v-tooltip
            bottom
          >
            <template v-slot:activator="{ on }">
              <v-btn
                :disabled="!isViewMode"
                icon
                color="warning"
                small
                class="mr-2"
                v-on="on"
                @click="addCompany"
              >
                <v-icon size="28">
                  mdi-plus-circle-outline
                </v-icon>
              </v-btn>
            </template>
            <span>Add Company</span>
          </v-tooltip>
          <v-tooltip
            bottom
          >
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
            <span>Upload Companies</span>
          </v-tooltip>
          <v-tooltip
            bottom
          >
            <template v-slot:activator="{ on }">
              <v-btn
                :disabled="!isViewMode"
                icon
                small
                class="mr-2"
                v-on="on"
                @click="showHideVrp"
              >
                <v-icon
                  v-if="showOrHide"
                  size="28"
                  color="primary"
                >
                  mdi-eye
                </v-icon>
                <v-icon
                  v-else
                  size="28"
                  color="gray"
                >
                  mdi-eye-off
                </v-icon>
              </v-btn>
            </template>
            <span v-if="showOrHide">Hide VRP Imports</span>
            <span v-else>Show All</span>
          </v-tooltip>
          <v-tooltip
            bottom
          >
            <template v-slot:activator="{ on }">
              <v-btn
                :disabled="!isViewMode"
                icon
                small
                class="mr-2"
                v-on="on"
                @click="showMergeVrp"
              >
                <v-icon
                  size="28"
                  :color="merge ? 'primary' : 'grey'"
                >
                  mdi-table-merge-cells
                </v-icon>
              </v-btn>
            </template>
            <span v-if="merge">Unmerge</span>
            <span v-else>Merge</span>
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
            <span>{{ `${ isViewMode ? 'Edit Companies' : 'Save Companies'}` }}</span>
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
            v-model="staticSearch.vrp_status"
            :items="$store.state.menuitems.vrpItems"
            item-text="text"
            item-value="value"
            label="VRP Status"
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
            v-model="staticSearch.networks"
            :items="networkItems"
            item-text="name"
            item-value="id"
            label="Networks"
            prepend-icon="mdi-lan"
            multiple
            clearable
          />
        </v-col>
      </v-row>
      <company-table-editor
        v-if="!isViewMode"
        :company-data="companies"
        :min-dimensions="[5, options.itemsPerPage]"
        :updated-status="updatedStatus"
        @change:content-changed="() => { notSaved = true}"
        @change:save-update="handleAfterSave"
      />
      <v-progress-linear
        v-if="loading"
        indeterminate
      />
      <v-data-table
        v-if="isViewMode"
        :headers="computedHeaders"
        :items="companies"
        :options.sync="options"
        :hide-default-footer="true"
        hide-default-header
        class="mt-5"
      >
        <template
          v-slot:header="{ props: { headers } }"
        >
          <tr class="company-header">
            <th
              v-for="(header, i) in headers"
              :key="i"
              style="font-weight: normal"
            >
              <v-tooltip
                v-if="header.icon"
                bottom
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    v-bind="attrs"
                    v-on="on"
                  >
                    {{ header.icon }}
                  </v-icon>
                </template>
                <span>{{ header.text }}</span>
              </v-tooltip>
              <v-badge
                v-else-if="header.badge"
                :color="header.text === 'DJS' ? 'primary' : 'error'"
                bottom
                :content="header.text"
              >
                <v-icon>{{ header.badge }}</v-icon>
              </v-badge>
              <template
                v-else
              >
                {{ header.text }}
              </template>
            </th>
          </tr>
        </template>
        <template v-slot:body="{ items }">
          <tbody>
            <tr
              v-for="(item, i) in items"
              :key="i"
              :class="{ 'vrp-sql': item.vrp_import === 1 }"
            >
              <td
                class="pl-5"
              >
                <v-tooltip
                  v-if="item.vrp_status"
                  bottom
                >
                  <template v-slot:activator="{ on }">
                    <span
                      dark
                      class="company-badge"
                      v-on="on"
                    >
                      <v-badge
                        slot="activator"
                        left
                        :color="item.vrp_status === 'Authorized' ? 'success' : item.vrp_status === 'Not Authorized' ? 'error' : 'warning'"
                      >
                        <template v-slot:badge>
                          <v-icon dark>
                            {{ item.vrp_status === 'Authorized' ? 'mdi-check' : item.vrp_status === 'Not Authorized' ? 'mdi-close' : 'mdi-link' }}
                          </v-icon>
                        </template>
                        <router-link
                          class="table-link"
                          :to="item.vrp_import === 1 ? '/companies/' + item.plan_number + '/vrpexpress' : '/companies/' + item.id"
                        >
                          {{ item.name | truncate(42) }}
                        </router-link>
                      </v-badge>
                    </span>
                  </template>
                  <span>{{ item.vrp_status }}</span>
                </v-tooltip>
                <router-link
                  v-else
                  class="table-link"
                  :to="item.vrp_import === 1 ? '/companies/' + item.plan_number + '/vrpexpress' : '/companies/' + item.id"
                >
                  {{ item.name | truncate(42) }}
                </router-link>
              </td>
              <td>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <span
                      dark
                      class="company-badge"
                      v-on="on"
                    >
                      <v-badge
                        slot="activator"
                        right
                        :color="item.vrp_stats.plan_type==='Tank' ? 'black' : 'blue'"
                        :value="item.vrp_stats.plan_type==='Tank' || item.vrp_stats.plan_type==='Non-Tank'"
                      >
                        <template v-slot:badge>
                          <v-icon dark>
                            {{ item.vrp_stats.plan_type==='Tank' ? 'mdi-water' : 'mdi-water-off' }}
                          </v-icon>
                        </template>
                        <span>
                          {{ item.plan_number }}
                        </span>
                      </v-badge>
                    </span>
                  </template>
                  <span>{{ item.vrp_stats.plan_type }}</span>
                </v-tooltip>
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
                        :icon="item.networks_active === 1 ? 'mdi-star' : 'mdi-hard-hat'"
                        :color="item.networks_active === 1 ? 'warning' : 'secondary'"
                        :value="item.networks_active === 1 || item.capabilies_active === 1"
                      >
                        <span>
                          <v-icon
                            v-if="item.vrp_import === 1"
                            color="gray"
                            size="30"
                          >
                            mdi-shield-search
                          </v-icon>
                          <v-icon
                            v-else-if="item.vendor_active === 1"
                            color="secondary"
                            size="30"
                          >
                            mdi-shield-link-variant
                          </v-icon>
                          <v-icon
                            v-else-if="item.active"
                            color="success"
                            size="30"
                          >
                            mdi-shield-check
                          </v-icon>
                          <v-icon
                            v-else
                            color="error"
                            size="30"
                          >
                            mdi-shield-off
                          </v-icon>
                        </span>
                      </v-badge>
                    </span>
                  </template>
                  <span v-if="item.vrp_import===1 && item.vrp_primary_smff!==null">
                    {{ item.vrp_primary_smff }}
                  </span>
                  <span v-if="item.vrp_import===1 && item.vrp_primary_smff===null">
                    No Provider Listed
                  </span>
                  <span v-if="item.vrp_import!==1 && item.vendor_active===1">
                    {{ item.vendor_type ? item.vendor_type.name : 'No Vendor' }}
                  </span>
                  <span v-if="item.vrp_import!==1 && item.vendor_active!==1 && item.active">
                    DJS SMFF Coverage
                  </span>
                  <span v-if="item.vrp_import!==1 && item.vendor_active!==1 && !item.active">
                    No DJS SMFF Coverage
                  </span>
                </v-tooltip>
              </td>
              <td
                class="d-none d-sm-table-cell"
              >
                {{ item.stats.individuals }}
              </td>
              <td class="d-none d-sm-table-cell">
                {{ item.stats.vessels }}
              </td>
              <td
                v-if="role && adminDutyNasa(role.id)"
                class="d-none d-sm-table-cell"
              >
                {{ item.vrp_stats.vessels }}
              </td>
              <td>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <span
                      dark
                      v-on="on"
                    >
                      <flag
                        :iso="item.location.length === 2 ? item.location : item.country"
                        :squared="false"
                      />
                    </span>
                  </template>
                  <span>{{ getCountryFromCode(item) }}</span>
                </v-tooltip>
              </td>
              <td
                v-if="item.vrp_import === 1"
              >
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      fab
                      x-small
                      color="secondary"
                      :loading="importing && index === i"
                      v-on="on"
                      @click="importCompany(item.plan_number); index = i"
                    >
                      <v-icon>mdi-import</v-icon>
                    </v-btn>
                  </template>
                  <span>Import To CDT</span>
                </v-tooltip>
              </td>
              <td v-else />
            </tr>
          </tbody>
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
      <add-company
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
  import { networkItemsDownload } from '@/mixins/menuItemsDownload/networkItemsDownload'
  import { qiItemsDownload } from '@/mixins/menuItemsDownload/qiItemsDownload'
  import { countryItemsDownload } from '@/mixins/menuItemsDownload/countryItemsDownload'
  import { MAIN_COMPANY } from '../../../shared/constants'
  import { checkCUD, adminDutyNasa } from '@/shared/management'

  export default {
    components: {
      CompanyTableEditor: () => import('../components/bulkEditors/CompanyTableEditor'),
      TableFooter: () => import('../components/TableFooter'),
      AddCompany: () => import('../components/forms/AddCompany'),
      ConfirmDialog: () => import('../components/ConfirmDialog.vue'),
    },
    mixins: [
      networkItemsDownload,
      countryItemsDownload,
      qiItemsDownload,
    ],
    data: () => ({
      search: '',
      companies: [],
      loading: 0,
      options: {},
      staticSearch: {
        active: -1,
        resource_provider: -1,
        include_vrp: -1,
        vrp_status: -1,
        networks: [],
        merge: -1,
      },
      total: 0,
      searchTimeout: null,
      advancedSearch: false,
      showAdd: false,
      addCounter: 0,
      showOrHide: true,
      merge: true,
      isViewMode: true,
      updatedStatus: 0,
      call: null, // used to stop previous axios request,
      index: -1,
      importing: false,
      checkCUD,
      adminDutyNasa,
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
      computedHeaders () {
        const filtered = MAIN_COMPANY.filter(item => !this.$vuetify.breakpoint.xs || item.showOnMobile)
        if (this.role) {
          if (this.adminDutyNasa(this.role.id)) return filtered
          else return filtered.filter(item => !item.internal)
        }
        return filtered
      },
      availableSteps () {
        const steps = [0, 1, 2, 3]
        return steps
      },
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
          let apiurl = `companies?page=${page}&per_page=${itemsPerPage}`
          if (this.search) {
            apiurl += `&query=${this.search.replace('&', '%26')}`
          } else if (sortBy[0]) {
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
          this.companies = res.data.data
          this.total = res.data.meta ? res.data.meta.total : res.data.total
        } catch (error) {
          if (!axios.isCancel(error)) {
            this.showSnackBar({ text: error, color: 'error' })
          }
        }
        this.loading--
        this.call = null
      },
      async importCompany (planNumber) {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        this.importing = true
        try {
          const response = await axios.post('companies/' + planNumber + '/import')
          response.data.success
            ? this.showSnackBar({ text: response.data.message, color: 'success' })
            : this.showSnackBar({ text: response.data.message, color: 'error' })
        } catch (err) {
          this.showSnackBar({ text: err, color: 'error' })
        }
        this.importing = false
      },
      uploadCompanyCsv (event) {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        const formData = new FormData()
        formData.append('file', event.target.files[0])
        axios.post(
          'companies/upload/bulkCsv',
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
          this.showSnackBar({ text: error.response.statusText, color: 'error' })
          this.getDataFromApi()
        })
      },
      getCountryFromCode (item) {
        const code = item.location.length === 2 ? item.location : item.country
        return (this.countryItems.find(v => v.id === code) || {}).name
      },
      showHideVrp () {
        this.showOrHide = !this.showOrHide
        if (this.showOrHide) {
          this.staticSearch.include_vrp = -1
        } else {
          this.staticSearch.include_vrp = 0
        }
        this.getDataFromApi()
      },
      showMergeVrp () {
        this.merge = !this.merge
        if (this.merge) {
          this.staticSearch.merge = -1
        } else {
          this.staticSearch.merge = 0
        }
        this.getDataFromApi()
      },
      addCompany () {
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
      async editOrSave () {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        if (this.isViewMode) {
          this.staticSearch.include_vrp = 0
          await this.getDataFromApi()
          this.isViewMode = !this.isViewMode
          this.updatedStatus = -1
        } else {
          if (this.showOrHide) {
            this.staticSearch.include_vrp = -1
          } else {
            this.staticSearch.include_vrp = 0
          }
          await this.getDataFromApi()
          this.updatedStatus = 1
        }
      },
      handleAfterSave (updatedCount, errCount) {
        this.notSaved = false
        this.isViewMode = true
        this.updatedStatus = 0
        if (errCount) {
          this.showSnackBar({ text: `${errCount} update${errCount > 1 ? 's' : ''} failed`, color: 'error' })
        }
        if (updatedCount > 0) {
          this.showSnackBar({ text: `${updatedCount} ${updatedCount > 1 ? 'companies' : 'company'} updated`, color: 'success' })
        }
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

<style lang="sass">
  #companies-index
    .company-header
      height: 40px
      text-align: left
  .vrp-sql
    background-color: #f7f7f7
    td, a
      color: gray !important
  .flag-icon
    pointer-events: none
</style>
