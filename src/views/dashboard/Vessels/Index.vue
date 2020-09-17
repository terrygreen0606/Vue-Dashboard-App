<template>
  <v-container
    fluid
    tag="section"
  >
    <input
      ref="file"
      type="file"
      class="d-none"
      @change="uploadVesselCsv"
    >
    <base-material-card
      color="primary"
      icon="mdi-ferry"
      inline
    >
      <template v-slot:after-heading>
        <div class="display-2">
          Vessels
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
                icon
                color="secondary"
                small
                v-on="on"
                @click="toggleCompanyShow"
              >
                <v-icon size="28">
                  mdi-domain
                </v-icon>
              </v-btn>
            </template>
            <span>{{ showCompany ? 'Hide' : 'View' }} Companies</span>
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
                v-on="on"
                @click="addVessel"
              >
                <v-icon size="28">
                  mdi-plus-circle-outline
                </v-icon>
              </v-btn>
            </template>
            <span>Add Vessel</span>
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
                v-on="on"
                @click="$refs.file.click()"
              >
                <v-icon size="28">
                  mdi-upload
                </v-icon>
              </v-btn>
            </template>
            <span>Upload Vessels</span>
          </v-tooltip>
          <v-tooltip
            bottom
          >
            <template v-slot:activator="{ on }">
              <v-btn
                :disabled="!isViewMode"
                icon
                small
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
            <span>{{ `${ isViewMode ? 'Edit Vessels' : 'Save Vessels'}` }}</span>
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
            v-model="staticSearch.types"
            :items="vesselTypeItems"
            item-text="name"
            item-value="id"
            label="Type"
            prepend-icon="mdi-ferry"
            multiple
            clearable
          />
        </v-col>
        <v-col
          v-if="role && guardAPI('vendors/qi', role.id)"
          cols="12"
          sm="3"
        >
          <v-autocomplete
            v-model="staticSearch.qi"
            :items="qiItems"
            item-text="name"
            item-value="id"
            label="QI"
            prepend-icon="mdi-anchor"
            multiple
            clearable
          />
        </v-col>
        <v-col
          v-if="role && guardAPI('vendors/pi', role.id)"
          cols="12"
          sm="3"
        >
          <v-autocomplete
            v-model="staticSearch.pi"
            :items="piItems"
            item-text="name"
            item-value="id"
            label="PI"
            prepend-icon="mdi-umbrella"
            multiple
            clearable
          />
        </v-col>
        <v-col
          v-if="role && guardAPI('vendors/societies', role.id)"
          cols="12"
          sm="3"
        >
          <v-autocomplete
            v-model="staticSearch.societies"
            :items="societyItems"
            item-text="name"
            item-value="id"
            label="Societies"
            prepend-icon="mdi-axis-arrow-lock"
            multiple
            clearable
          />
        </v-col>
        <v-col
          v-if="role && guardAPI('vendors/insurers', role.id)"
          cols="12"
          sm="3"
        >
          <v-autocomplete
            v-model="staticSearch.insurers"
            :items="insurerItems"
            item-text="name"
            item-value="id"
            label="Insurers"
            prepend-icon="mdi-engine"
            multiple
            clearable
          />
        </v-col>
        <v-col
          v-if="role && guardAPI('vendors/providers', role.id)"
          cols="12"
          sm="3"
        >
          <v-autocomplete
            v-model="staticSearch.providers"
            :items="providerItems"
            item-text="name"
            item-value="id"
            label="Providers"
            prepend-icon="mdi-chart-bell-curve"
            multiple
            clearable
          />
        </v-col>
        <v-col
          v-if="role && guardAPI('fleets', role.id)"
          cols="12"
          sm="3"
        >
          <v-autocomplete
            v-model="staticSearch.fleets"
            :items="fleetItems"
            item-text="name"
            item-value="id"
            label="Fleets"
            prepend-icon="mdi-anchor"
            multiple
            clearable
          />
        </v-col>
        <v-col
          v-if="role && guardAPI('companies/short', role.id)"
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
            v-model="staticSearch.vrp_status"
            :items="$store.state.menuitems.vrpItems"
            item-text="text"
            item-value="value"
            label="VRP Express"
            prepend-icon="mdi-check"
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
      <table-editor
        v-if="!isViewMode"
        :vessel-data="vessels.filter(vessel => vessel.company)"
        :min-dimensions="[4, options.itemsPerPage]"
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
        :items="vessels"
        :options.sync="options"
        :hide-default-footer="true"
        class="mt-5"
      >
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
                  v-if="item.vrp_status==='Authorized' || item.vrp_status==='Not Authorized'"
                  right
                >
                  <template v-slot:activator="{ on }">
                    <span
                      dark
                      v-on="on"
                    >
                      <v-badge
                        v-if="role && adminDutyNasa(role.id)"
                        slot="activator"
                        left
                        :color="item.linked === 1 ? 'success' : item.linked === 2 || item.linked === 3 ? 'warning' : 'error'"
                        :value="item.vrp_status==='Authorized' || item.vrp_status==='Not Authorized'"
                      >
                        <template v-slot:badge>
                          <v-icon dark>
                            {{ item.linked === 1 ? 'mdi-check' : item.linked === 0 ? 'mdi-close' : item.linked === 2 ? 'mdi-exclamation-thick' : 'mdi-link' }}
                          </v-icon>
                        </template>
                        <router-link
                          class="table-link"
                          :to="item.vrp_import
                            ? `/vessels/${item.id}/vrpexpress`
                            : role && (isVesselViewer(role.id) || isCompanyPlanManager(role.id))
                              ? `/vessels/${item.id}/construction`
                              : `/vessels/${item.id}`"
                        >
                          {{ item.name | truncate(42) }}
                        </router-link>
                      </v-badge>
                      <router-link
                        v-else
                        class="table-link"
                        :to="item.vrp_import
                          ? `/vessels/${item.id}/vrpexpress`
                          : role && (isVesselViewer(role.id) || isCompanyPlanManager(role.id))
                            ? `/vessels/${item.id}/construction`
                            : `/vessels/${item.id}`"
                      >
                        {{ item.name | truncate(42) }}
                      </router-link>
                    </span>
                  </template>
                  <span v-if="item.linked === 1 || item.linked === 0">{{ item.vrp_status }}</span>
                  <span v-if="item.linked === 2">VRP Does Not Match</span>
                  <span v-if="item.linked === 3">No Vrp Link</span>
                </v-tooltip>
                <router-link
                  v-else
                  class="table-link"
                  :to="item.vrp_import
                    ? `/vessels/${item.id}/vrpexpress`
                    : role && (isVesselViewer(role.id) || isCompanyPlanManager(role.id))
                      ? `/vessels/${item.id}/construction`
                      : `/vessels/${item.id}`"
                >
                  {{ item.name | truncate(42) }}
                </router-link>
              </td>
              <td class="d-none d-sm-table-cell">
                <span>{{ item.imo }}</span>
              </td>
              <td class="d-none d-sm-table-cell">
                {{ item.official_number ? item.official_number : '-' }}
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
                  <span v-if="item.vrp_import === 1">{{ item.vrp_primary_smff }}</span> <!-- not yet -->
                  <span v-else-if="item.active">DJS SMFF Coverage</span>
                  <span v-else>No DJS SMFF Coverage</span>
                  <span v-if="item.vrp_import === 1 && item.vrp_primary_smff === null">No Provider</span>
                </v-tooltip>
              </td>
              <td class="pl-5">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <span
                      dark
                      v-on="on"
                    >
                      <v-badge
                        slot="activator"
                        left
                        :color="item.tanker ? 'black' : 'blue'"
                      >
                        <template v-slot:badge>
                          <v-icon dark>
                            {{ item.tanker ? 'mdi-water' : 'mdi-water-off' }}
                          </v-icon>
                        </template>
                        <span>
                          {{ item.type }}
                        </span>
                      </v-badge>
                    </span>
                  </template>
                  <span>{{ item.tanker ? 'Tank' : 'Non Tank' }}</span>
                </v-tooltip>
              </td>
              <td
                class="d-none d-sm-table-cell"
              >
                <v-tooltip
                  v-if="item.vrp_status==='Authorized' || item.vrp_status==='Not Authorized'"
                  bottom
                >
                  <template v-slot:activator="{ on }">
                    <span
                      dark
                      v-on="on"
                    >
                      <v-badge
                        v-if="role && adminDutyNasa(role.id)"
                        slot="activator"
                        :color="item.linked === 1 ? 'success' : item.linked === 2 || item.linked === 3 ? 'warning' : 'error'"
                        :value="item.vrp_status==='Authorized' || item.vrp_status==='Not Authorized'"
                      >
                        <template
                          v-slot:badge
                        >
                          <v-icon dark>
                            {{ item.linked === 1 ? 'mdi-check' : item.linked === 0 ? 'mdi-close' : item.linked === 2 ? 'mdi-exclamation-thick' : 'mdi-link' }}
                          </v-icon>
                        </template>
                        <router-link
                          v-if="item.vrp_plan_number_id>0 && item.company && item.company.id>0"
                          class="table-link"
                          :to="'/companies/' + item.company.id"
                        >
                          {{ item.vrp_plan_number_id }}
                        </router-link>
                        <span v-else>{{ item.vrp_plan_number }}</span>
                      </v-badge>
                      <template v-else>
                        <router-link
                          v-if="item.vrp_plan_number_id>0 && item.company && item.company.id>0"
                          class="table-link"
                          :to="'/companies/' + item.company.id"
                        >
                          {{ item.vrp_plan_number_id }}
                        </router-link>
                        <span v-else>{{ item.vrp_plan_number }}</span>
                      </template>
                    </span>
                  </template>
                  <span v-if="item.linked === 1 || item.linked === 0">{{ item.vrp_status }}</span>
                  <span v-if="item.linked === 2">VRP Does Not Match</span>
                  <span v-if="item.linked === 3">No Vrp Link</span>
                </v-tooltip>
                <router-link
                  v-else-if="item.vrp_plan_number_id>0 && item.company && item.company.id>0"
                  class="table-link"
                  :to="'/companies/' + item.company.id"
                >
                  {{ item.vrp_plan_number }}
                </router-link>
              </td>
              <td v-if="showCompany">
                <router-link
                  v-if="item.company"
                  class="table-link"
                  :to="'/companies/' + item.company.id"
                >
                  {{ item.companyName }}
                </router-link>
                <span v-else>{{ item.companyName }}</span>
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
                      @click="importVessel(item.id); index = i"
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
      <add-vessel
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
  import { vesselTypeItemsDownload } from '@/mixins/menuItemsDownload/vesselTypeItemsDownload'
  import { fleetItemsDownload } from '@/mixins/menuItemsDownload/fleetItemsDownload'
  import { networkItemsDownload } from '@/mixins/menuItemsDownload/networkItemsDownload'
  import { piItemsDownload } from '@/mixins/menuItemsDownload/piItemsDownload'
  import { qiItemsDownload } from '@/mixins/menuItemsDownload/qiItemsDownload'
  import { societyItemsDownload } from '@/mixins/menuItemsDownload/societyItemsDownload'
  import { providerItemsDownload } from '@/mixins/menuItemsDownload/providerItemsDownload'
  import { insurerItemsDownload } from '@/mixins/menuItemsDownload/insurerItemsDownload'
  import { companyItemsDownload } from '@/mixins/menuItemsDownload/companyItemsDownload'
  import { checkCUD, guardAPI, isVesselViewer, isCompanyPlanManager, adminDutyNasa } from '@/shared/management'

  export default {
    components: {
      TableEditor: () => import('../components/bulkEditors/VesselTableEditor'),
      TableFooter: () => import('../components/TableFooter'),
      AddVessel: () => import('../components/forms/AddVessel'),
      ConfirmDialog: () => import('../components/ConfirmDialog.vue'),
    },
    mixins: [
      vesselTypeItemsDownload,
      fleetItemsDownload,
      networkItemsDownload,
      piItemsDownload,
      qiItemsDownload,
      societyItemsDownload,
      providerItemsDownload,
      insurerItemsDownload,
      companyItemsDownload,
    ],
    data: () => ({
      search: '',
      headers: [
        {
          text: 'Vessel Name',
          value: 'name',
          showOnMobile: true,
        },
        {
          text: 'IMO',
          value: 'imo',
        },
        {
          text: 'Official #',
          value: 'official_number',
        },
        {
          text: 'Status',
          value: 'djs_coverage',
          sortable: false,
          showOnMobile: true,
        },
        {
          text: 'Vessel Type',
          value: 'vessel_type',
          sortable: false,
          showOnMobile: true,
        },
        {
          text: 'Plan',
          value: 'plan_number',
          sortable: false,
        },
        {
          text: 'Company',
          value: 'companyName',
        },
        {
          text: 'Action',
          value: '',
          sortable: false,
          showOnMobile: true,
        },
      ],
      staticSearch: {
        active: -1,
        resource_provider: -1,
        include_vrp: -1,
        company_vessel: 0,
        types: [],
        qi: [],
        pi: [],
        response: [],
        societies: [],
        insurers: [],
        providers: [],
        vendors: [],
        fleets: [],
        vrp_status: -1,
        vrp_comparison: -1,
        companies: [],
        networks: [],
        merge: -1,
      },
      vessels: [],
      total: 0,
      options: {},
      loading: 0,
      searchTimeout: null,
      advancedSearch: false,
      showOrHide: true,
      merge: true,
      isViewMode: true,
      updatedStatus: 0,
      showAdd: false,
      addCounter: 0,
      call: null, // used to stop previous axios request,
      index: -1,
      importing: false,
      checkCUD,
      guardAPI,
      isVesselViewer,
      isCompanyPlanManager,
      adminDutyNasa,
      saveChanges: false,
      confirmText: 'If you continue, your progress will be lost.\n Do you want to leave this page without saving?',
      to: null,
      next: null,
      notSaved: false,
      showCompany: false,
    }),
    computed: {
      ...mapState({
        role: state => state.authentication.role,
      }),
      availableSteps () {
        const steps = [0, 1, 2, 3]
        return steps
      },
      computedHeaders () {
        const headers = this.headers.filter(item => !this.$vuetify.breakpoint.xs || item.showOnMobile)
        return this.showCompany ? headers : headers.filter(header => header.text !== 'Company')
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
          let apiurl = `vessels?page=${page}&per_page=${itemsPerPage}`
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
          this.vessels = res.data.data.map(vessel => ({ ...vessel, companyName: vessel.company ? vessel.company.name : 'No Company' }))
          this.total = res.data.meta ? res.data.meta.total : res.data.total
        } catch (error) {
          if (!axios.isCancel(error)) {
            this.showSnackBar({ text: error, color: 'error' })
          }
        }
        this.loading--
        this.call = null
      },
      async importVessel (id) {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        this.importing = true
        try {
          const response = await axios.post('vessels/' + id + '/import')
          response.data.success
            ? this.showSnackBar({ text: response.data.message, color: 'success' })
            : this.showSnackBar({ text: response.data.message, color: 'error' })
        } catch (err) {
          this.showSnackBar({ text: err, color: 'error' })
        }
        this.importing = false
      },
      uploadVesselCsv (event) {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        const formData = new FormData()
        formData.append('file', event.target.files[0])
        axios.post(
          'vessels/upload/bulkCsv',
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
      showHideVrp () {
        this.showOrHide = !this.showOrHide
        if (this.showOrHide) {
          this.staticSearch.include_vrp = -1
        } else {
          this.staticSearch.include_vrp = 0
        }
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
      async editOrSave () {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        if (this.isViewMode) {
          this.notSaved = true
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
        if (errCount > 0) {
          this.showSnackBar({ text: `${errCount} update${errCount > 1 ? 's' : ''} failed`, color: 'error' })
        }
        if (updatedCount > 0) {
          this.showSnackBar({ text: `${updatedCount} vessel${updatedCount > 1 ? 's' : ''} updated`, color: 'success' })
        }
      },
      addVessel () {
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
      toggleCompanyShow () {
        this.showCompany = !this.showCompany
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
  @media (max-width: 900px)
    .v-tabs-bar__content
      flex-direction: column
    .v-tabs-bar--is-mobile
      height: 150px !important
    .v-tab--active
      background-color: #023b68
      border-color: #023b68
    .v-tabs-slider-wrapper
      display: none
  .vrp-sql
    background-color: #f7f7f7
    td, a
      color: gray !important
</style>
