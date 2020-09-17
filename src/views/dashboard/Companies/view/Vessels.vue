<template>
  <base-material-card
    color="primary"
    :title="companyName ? `${companyName} - Vessels` : 'Vessels'"
  >
    <v-progress-linear
      v-if="!!loading"
      indeterminate
    />
    <v-row align="end">
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        class="ml-auto mr-3"
        label="Search"
        hide-details
        single-line
        clearable
        style="max-width: 200px;"
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
          <span>{{ `${ isViewMode ? 'Edit Vessels' : 'Save Vessels'}` }}</span>
        </v-tooltip>
      </template>
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
        cols="12"
        sm="3"
      >
        <v-autocomplete
          v-if="role && guardAPI('vendors/societies', role.id)"
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
        cols="12"
        sm="3"
      >
        <v-autocomplete
          v-if="role && guardAPI('vendors/insurers', role.id)"
          v-model="staticSearch.insurers"
          :items="insurerItems"
          item-text="name"
          item-value="id"
          label="Hull and Machinery"
          prepend-icon="mdi-engine"
          multiple
          clearable
        />
      </v-col>
      <v-col
        cols="12"
        sm="3"
      >
        <v-autocomplete
          v-if="role && guardAPI('vendors/providers', role.id)"
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
    </v-row>
    <table-editor
      v-if="!isViewMode"
      :vessel-data="vessels.filter(vessel => vessel.company)"
      :min-dimensions="[4, options.itemsPerPage]"
      :updated-status="updatedStatus"
      @change:content-changed="() => { notSaved = true}"
      @change:save-update="handleAfterSave"
    />
    <v-data-table
      v-if="isViewMode"
      v-model="selectAll"
      :headers="headers"
      :items="vessels"
      :options.sync="options"
      :hide-default-footer="true"
      show-select
      class="mt-5"
    >
      <template v-slot:body="{ items }">
        <tbody>
          <tr
            v-for="(item, i) in items"
            :key="i"
            :class="{ 'vrp-sql': item.vrp_import === 1 }"
          >
            <td>
              <label class="form-checkbox">
                <input
                  v-model="selected"
                  type="checkbox"
                  :value="item.id"
                >
                <i class="form-icon" />
              </label>
            </td>
            <td class="pl-5">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <span
                    dark
                    class="company-badge"
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
            </td>
            <td>
              <v-tooltip right>
                <template v-slot:activator="{ on }">
                  <span
                    dark
                    v-on="on"
                  >
                    {{ item.imo }}
                  </span>
                </template>
                <span>{{ item.vrp_status }}</span>
              </v-tooltip>
            </td>
            <td>{{ item.official_number ? item.official_number : '-' }}</td>
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
                <span v-else-if="item.djs_active === 1">DJS SMFF Coverage</span>
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
            <td>
              <v-tooltip bottom>
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
                      <template v-slot:badge>
                        <v-icon dark>
                          {{ item.linked === 1 ? 'mdi-check' : item.linked === 0 ? 'mdi-close' : item.linked === 2 ? 'mdi-exclamation-thick' : 'mdi-link' }}
                        </v-icon>
                      </template>
                      <span v-if="item.vrp_import===1">{{ item.vrp_plan_number }}</span>
                      <span v-else>{{ item.vrp_plan_number_id }}</span>
                    </v-badge>
                    <template v-else>
                      <span v-if="item.vrp_import===1">{{ item.vrp_plan_number }}</span>
                      <span v-else>{{ item.vrp_plan_number_id }}</span>
                    </template>
                  </span>
                </template>
                <span v-if="item.linked === 1 || item.linked === 0">{{ item.vrp_status }}</span>
                <span v-if="item.linked === 2">VRP Does Not Match</span>
                <span v-if="item.linked === 3">No Vrp Link</span>
              </v-tooltip>
            </td>
            <td>
              <v-speed-dial
                v-model="fab[i]"
                direction="left"
              >
                <template v-slot:activator>
                  <v-btn
                    v-model="fab[i]"
                    fab
                    small
                    color="primary"
                    :loading="importing && index === i"
                  >
                    <v-icon v-if="fab[i]">
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
                  :to="item.vrp_import
                    ? `/vessels/${item.id}/vrpexpress`
                    : `/vessels/${item.id}`"
                >
                  <v-icon color="white">
                    mdi-eye
                  </v-icon>
                </v-btn>
                <v-btn
                  v-if="item.vrp_import"
                  fab
                  x-small
                  color="secondary"
                  @click="importVessel(item.id); index = i"
                >
                  <v-icon>mdi-import</v-icon>
                </v-btn>
                <v-btn
                  v-else
                  fab
                  x-small
                  color="error"
                  @click="deleteMsg = true, vesselToDelete = item"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-speed-dial>
            </td>
          </tr>
        </tbody>
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
          You are about to delete or unlink a vessel
        </v-card-title>
        <v-card-text>
          Please confirm that you would like to delete or unlink the following vessel: <b>{{ vesselToDelete.name }}</b>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="warning"
            text
            @click="unlinkVessel(vesselToDelete.id)"
          >
            Remove Link
          </v-btn>
          <v-btn
            color="error"
            text
            @click="deleteVessel(vesselToDelete.id)"
          >
            Delete Vessel
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

    <!-- add vessel dialog -->
    <v-dialog
      v-model="showAdd"
      max-width="700"
      @click:outside="closeAdd"
      @keydown.esc="closeAdd"
    >
      <add-vessel
        :counter="addCounter"
        :company-id="$route.params.id"
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
  import { vesselTypeItemsDownload } from '@/mixins/menuItemsDownload/vesselTypeItemsDownload'
  import { piItemsDownload } from '@/mixins/menuItemsDownload/piItemsDownload'
  import { qiItemsDownload } from '@/mixins/menuItemsDownload/qiItemsDownload'
  import { societyItemsDownload } from '@/mixins/menuItemsDownload/societyItemsDownload'
  import { providerItemsDownload } from '@/mixins/menuItemsDownload/providerItemsDownload'
  import { insurerItemsDownload } from '@/mixins/menuItemsDownload/insurerItemsDownload'
  import { checkCUD, guardAPI, adminDutyNasa } from '@/shared/management'

  export default {
    components: {
      TableEditor: () => import('../../components/bulkEditors/VesselTableEditor'),
      TableFooter: () => import('../../components/TableFooter'),
      AddVessel: () => import('../../components/forms/AddVessel'),
      ConfirmDialog: () => import('../../components/ConfirmDialog.vue'),
    },
    mixins: [
      companyItemsDownload,
      vesselTypeItemsDownload,
      piItemsDownload,
      qiItemsDownload,
      societyItemsDownload,
      providerItemsDownload,
      insurerItemsDownload,
    ],
    data: () => ({
      search: '',
      selected: [],
      selectAll: [],
      headers: [
        {
          text: 'Vessel Name',
          value: 'name',
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
        },
        {
          text: 'Vessel Type',
          value: 'vessel_type',
          sortable: false,
        },
        {
          text: 'Plan',
          value: 'plan_number',
          sortable: false,
        },
        {
          text: 'Action',
          value: 'action',
          sortable: false,
        },
      ],
      staticSearch: {
        active: -1,
        resource_provider: -1,
        include_vrp: -1,
        company_vessel: 1,
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
        networks: [],
        merge: -1,
      },
      vessels: [],
      total: 0,
      options: {},
      loading: 0,
      searchTimeout: null,
      advancedSearch: false,
      deleteMsg: false,
      companyName: '',
      showOrHide: true,
      merge: true,
      fab: {},
      vesselToDelete: {
        id: -1,
        name: '',
      },
      isViewMode: true,
      updatedStatus: 0,
      showAdd: false,
      addCounter: 0,
      call: null, // used to stop previous axios request,
      index: -1,
      importing: false,
      guardAPI,
      checkCUD,
      saveChanges: false,
      confirmText: 'If you continue, your progress will be lost.\n Do you want to leave this page without saving?',
      to: null,
      next: null,
      notSaved: false,
      adminDutyNasa,
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
      selectAll: function (newSelect, oldSelect) {
        if (newSelect.length > oldSelect.length) {
          newSelect.forEach(element => {
            if (!this.selected.includes(element.id)) {
              this.selected.push(element.id)
            }
          })
        } else {
          const removedSelect = oldSelect.filter(element => !newSelect.includes(element)).map(elem => elem.id)
          this.selected = this.selected.filter(element => !removedSelect.includes(element))
        }
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
    async mounted () {
      this.staticSearch.company = this.$route.params.id
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
          let apiurl = `vessels?page=${page}&per_page=${itemsPerPage}`
          if (this.search) {
            apiurl += `&query=${this.search.replace('&', '%26')}`
          } else if (sortBy[0]) {
            const direction = sortDesc[0] ? 'desc' : 'asc'
            apiurl += `&direction=${direction}&sortBy=${sortBy[0]}`
          }

          // if have preivous call, cancel it
          if (this.call) {
            this.call.cancel()
          }

          // create a new call
          this.call = axios.CancelToken.source()
          const filterSelected = this.selected.slice((page - 1) * itemsPerPage, page * itemsPerPage)
          const res = await axios.post(
            apiurl,
            {
              staticSearch: this.staticSearch,
              bulkSelected: filterSelected,
            },
            { cancelToken: this.call.token },
          )
          this.vessels = res.data.data
          this.total = res.data.meta ? res.data.meta.total : res.data.total
          if (!this.isViewMode && this.selected.length > 0) {
            this.total = this.selected.length
            this.vessels = this.vessels.filter(vessel => {
              return filterSelected.includes(vessel.id)
            })
          }
        } catch (error) {
          if (!axios.isCancel(error)) {
            this.showSnackBar({ text: error, color: 'error' })
          }
        }
        this.loading--
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
      unlinkVessel (id) {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        axios.get('companies/' + id + '/unlinkVessels')
          .then(res => {
            this.deleteMsg[id] = false
            this.showSnackBar({ text: res.data.message, color: 'success' })
            this.getDataFromApi()
          })
      },
      deleteVessel (id) {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        axios.delete('vessels/' + id + '/destroy')
          .then(res => {
            this.deleteMsg[id] = false
            this.showSnackBar({ text: res.data.message, color: 'success' })
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
  .vrp-sql
    background-color: #f7f7f7
    td, a
      color: gray !important
</style>
