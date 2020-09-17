<template>
  <v-container
    fluid
    tag="section"
  >
    <base-material-card
      color="primary"
      icon="mdi-map-marker"
      inline
    >
      <template v-slot:after-heading>
        <div class="display-2">
          Latest AIS Positions
        </div>
      </template>

      <v-row align="end">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          class="ml-auto mr-3"
          label="Search"
          hide-details
          single-line
          clearable
          style="max-width: 160px;"
        />
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              color="primary"
              small
              class="mr-3"
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
      </v-row>

      <v-row v-if="advancedSearch">
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
        <!-- <v-col
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
        </v-col> -->
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

      <v-progress-linear
        v-if="loading1"
        indeterminate
      />

      <v-data-table
        :headers="HEADERS"
        :items="vessels"
        :options.sync="options"
        hide-default-footer
        class="mt-5"
      >
        <template v-slot:body="{ items }">
          <tbody>
            <tr
              v-for="(vessel, i) in items"
              :key="i"
            >
              <td>{{ vessel.name }}</td>
              <td>{{ vessel.ais_lat }}</td>
              <td>{{ vessel.ais_long }}</td>
              <td>{{ vessel.ais_dsrc }}</td>
              <td>{{ vessel.ais_timestamp }}</td>
              <td>
                <v-speed-dial
                  v-model="fab[i]"
                  direction="left"
                >
                  <template v-slot:activator>
                    <v-btn
                      v-model="fab[i]"
                      class="mb-0"
                      color="warning"
                      fab
                      x-small
                    >
                      <v-icon v-if="fab[i]">
                        mdi-close
                      </v-icon>
                      <v-icon v-else>
                        mdi-chevron-left
                      </v-icon>
                    </v-btn>
                  </template>
                  <v-tooltip
                    v-for="(action, j) in ACTIONS"
                    :key="j"
                    bottom
                  >
                    <template v-slot:activator="{ on }">
                      <v-btn
                        :color="action.color"
                        fab
                        x-small
                        v-on="on"
                        @click="trigger(action.what, vessel.id)"
                      >
                        <v-icon v-text="action.icon" />
                      </v-btn>
                    </template>
                    <span>{{ action.what }}</span>
                  </v-tooltip>
                </v-speed-dial>
              </td>
            </tr>
          </tbody>
        </template>
      </v-data-table>
      <table-footer
        :options="options"
        :total="total"
      />
    </base-material-card>

    <fetch-dialog
      :id="vesselId"
      :show="fetchDialogModel"
      @get:data-from-api="getDataFromApi"
      @close:dialog="() => { fetchDialogModel = false }"
    />
  </v-container>
</template>

<script>
  import axios from 'axios'
  import { mapActions } from 'vuex'
  import { vesselTypeItemsDownload } from '@/mixins/menuItemsDownload/vesselTypeItemsDownload'
  import { qiItemsDownload } from '@/mixins/menuItemsDownload/qiItemsDownload'
  import { piItemsDownload } from '@/mixins/menuItemsDownload/piItemsDownload'
  import { societyItemsDownload } from '@/mixins/menuItemsDownload/societyItemsDownload'
  import { insurerItemsDownload } from '@/mixins/menuItemsDownload/insurerItemsDownload'
  import { providerItemsDownload } from '@/mixins/menuItemsDownload/providerItemsDownload'
  import { fleetItemsDownload } from '@/mixins/menuItemsDownload/fleetItemsDownload'
  import { companyItemsDownload } from '@/mixins/menuItemsDownload/companyItemsDownload'
  import { networkItemsDownload } from '@/mixins/menuItemsDownload/networkItemsDownload'

  const HEADERS = [
    {
      text: 'Vessel Name',
      value: 'name',
    },
    {
      text: 'Latitude',
      value: 'ais_lat',
    },
    {
      text: 'Longitude',
      value: 'ais_long',
    },
    {
      text: 'Source',
      value: 'ais_dsrc',
      sortable: false,
    },
    {
      text: 'Timestamp',
      value: 'ais_timestamp',
    },
    {
      text: 'Actions',
      sortable: false,
    },
  ]

  const ACTION_FETCH = 'Fetch AIS Information'
  const ACTION_TO_MAP = 'Show on Map'
  const ACTION_TO_VESSEL = 'Detailed Information'

  const ACTIONS = [
    {
      color: 'error',
      icon: 'mdi-download-network',
      what: ACTION_FETCH,
    },
    {
      color: 'success',
      icon: 'mdi-map-marker',
      what: ACTION_TO_MAP,
    },
    {
      color: 'primary',
      icon: 'mdi-ferry',
      what: ACTION_TO_VESSEL,
    },
  ]

  export default {
    name: 'LatestAISPositions',

    components: {
      TableFooter: () => import('./components/TableFooter'),
      FetchDialog: () => import('./Map/components/InfoDrawer/dialogs/FetchDialog'),
    },

    mixins: [
      vesselTypeItemsDownload,
      qiItemsDownload,
      piItemsDownload,
      societyItemsDownload,
      insurerItemsDownload,
      providerItemsDownload,
      fleetItemsDownload,
      companyItemsDownload,
      networkItemsDownload,
    ],

    data: () => ({
      search: '',
      loading1: false,
      vessels: [],
      options: {},
      total: 0,
      searchTimeout: null,
      fab: {},
      vesselId: 0,
      fetchDialogModel: false,
      advancedSearch: false,
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
      },
      call: null, // used to stop previous axios request
    }),

    watch: {
      options: {
        handler: function (value) {
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
      this.getDataFromApi()
    },

    created () {
      this.HEADERS = HEADERS
      this.ACTIONS = ACTIONS
    },

    methods: {
      ...mapActions({
        showSnackBar: 'showSnackBar',
      }),

      getDataFromApi () {
        const { sortBy, sortDesc, page, itemsPerPage } = this.options
        let apiUrl = `vessels/latest-ais-positions?page=${page}&per-page=${itemsPerPage}`
        if (this.search) {
          apiUrl += `&search=${this.search.replace('&', '%26')}`
        }
        if (sortBy[0]) {
          const direction = sortDesc[0] ? 'desc' : 'asc'
          apiUrl += `&direction=${direction}&sort-by=${sortBy[0]}`
        }

        // if have preivous call, cancel it
        if (this.call) {
          this.call.cancel()
        }

        // create a new call
        this.call = axios.CancelToken.source()

        this.loading1 = true
        axios
          .post(
            apiUrl,
            { staticSearch: this.staticSearch },
            { cancelToken: this.call.token },
          )
          .then(res => {
            this.vessels = res.data.data
            this.total = res.data.total
            this.call = null
          })
          .catch(err => {
            if (!axios.isCancel(err)) {
              this.showSnackBar({ text: err, color: 'error' })
            }
          })
          .finally(() => {
            this.loading1 = false
          })
      },

      trigger (action, vesselId) {
        switch (action) {
          case ACTION_FETCH:
            this.vesselId = vesselId
            this.fetchDialogModel = true
            break
          case ACTION_TO_MAP:
            this.$router.push({ path: '/map', query: { vessel: vesselId } })
            break
          case ACTION_TO_VESSEL:
            this.$router.push(`/vessels/${vesselId}`)
            break
          default:
        }
      },
    },
  }
</script>
