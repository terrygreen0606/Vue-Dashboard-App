<template>
  <v-container
    id="ais-table"
    fluid
    tag="section"
  >
    <v-row>
      <v-col
        md="12"
        lg="6"
      >
        <base-material-card
          color="secondary"
          icon="mdi-security-network"
          inline
          title="Networks' AIS"
          class="px-5 py-3 mb-5"
        >
          <v-progress-linear
            v-if="networkLoading || !Object.keys(extendedNetworkItems).length"
            indeterminate
          />
          <v-divider class="mt-3 mb-5" />
          <v-simple-table>
            <thead>
              <tr>
                <th class="text-left">
                  Network Name
                </th>
                <th class="text-left">
                  Last Updated
                </th>
                <th class="text-center">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">
                        mdi-alert-circle
                      </v-icon>
                    </template>
                    <span>One Time Actions</span>
                  </v-tooltip>
                </th>
                <th class="text-center">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">
                        mdi-radio-tower
                      </v-icon>
                    </template>
                    <span>Terrestrial Positions Continuous</span>
                  </v-tooltip>
                </th>
                <th class="text-center">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">
                        mdi-satellite-variant
                      </v-icon>
                    </template>
                    <span>Satellite Positions Continuous</span>
                  </v-tooltip>
                </th>
              </tr>
            </thead>

            <tbody v-if="extendedNetworkItems.length">
              <tr
                v-for="network in extendedNetworkItems"
                :key="network.id"
              >
                <td class="text-left">
                  {{ network.name }}
                </td>
                <td class="text-left">
                  {{ network.ais_last_updated_at ? network.ais_last_updated_at : 'Not Yet Run' }}
                </td>
                <td
                  class="text-center"
                >
                  <v-btn
                    small
                    text
                    fab
                    @click="selectAis = true, networkId = network.id"
                  >
                    <v-icon>mdi-download-network</v-icon>
                  </v-btn>
                </td>
                <td class="text-center">
                  <v-switch
                    v-model="network.ter_status"
                    :loading="network.ter_status ? 'secondary' : false"
                    class="text-center"
                    @change="addAisPoll(network, 1, 0, 3)"
                  />
                </td>
                <td class="text-center">
                  <v-switch
                    v-model="network.sat_status"
                    :loading="network.sat_status ? 'secondary' : false"
                    class="text-center"
                    @change="addAisPoll(network, 1, 1, 4)"
                  />
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </base-material-card>
        <base-material-card
          color="primary"
          icon="mdi-anchor"
          inline
          title="Fleet AIS"
          class="px-5 py-3 mb-5"
        >
          <v-progress-linear
            v-if="fleetLoading"
            indeterminate
          />
          <v-divider class="mt-3 mb-5" />
          <v-simple-table>
            <thead>
              <tr>
                <th class="text-left">
                  Fleet Name
                </th>
                <th class="text-left">
                  Last Updated
                </th>
                <th class="text-center">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">
                        mdi-alert-circle
                      </v-icon>
                    </template>
                    <span>One Time Actions</span>
                  </v-tooltip>
                </th>
                <th class="text-center">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">
                        mdi-radio-tower
                      </v-icon>
                    </template>
                    <span>Terrestrial Positions Continuous</span>
                  </v-tooltip>
                </th>
                <th class="text-center">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">
                        mdi-satellite-variant
                      </v-icon>
                    </template>
                    <span>Satellite Positions Continuous</span>
                  </v-tooltip>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="fleet in extendedFleetItems"
                :key="fleet.id"
              >
                <td class="text-left">
                  {{ fleet.name }}
                </td>
                <td class="text-left">
                  {{ fleet.ais_last_updated_at ? fleet.ais_last_updated_at : 'Not Yet Run' }}
                </td>
                <td
                  class="text-center"
                >
                  <v-btn
                    small
                    text
                    fab
                    @click="selectAis = true, fleetId = fleet.id"
                  >
                    <v-icon>mdi-download-network</v-icon>
                  </v-btn>
                </td>
                <td class="text-center">
                  <v-switch
                    v-model="fleet.ter_status"
                    :loading="fleet.ter_status ? 'primary' : false"
                    class="text-center"
                    @change="addAisPoll(fleet, 0, 0, 3)"
                  />
                </td>
                <td class="text-center">
                  <v-switch
                    v-model="fleet.sat_status"
                    :loading="fleet.sat_status ? 'primary' : false"
                    class="text-center"
                    @change="addAisPoll(fleet, 0, 1, 4)"
                  />
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </base-material-card>
        <base-material-card
          color="info"
          icon="mdi-cash"
          inline
          title="AIS Credits"
          class="px-5 py-3 mb-5"
        >
          <v-row no-gutters>
            <p class="display-1">
              You have <strong>${{ credits }}</strong> left.
            </p>
          </v-row>
          <v-row class="justify-end">
            <v-btn
              color="info"
              :loading="fetchingCredits"
              @click="fetchCredits"
            >
              <v-icon left>
                mdi-cash
              </v-icon>
              Fetch Credits
            </v-btn>
          </v-row>
        </base-material-card>
      </v-col>
      <v-col
        md="12"
        lg="6"
      >
        <base-material-card
          color="warning"
          icon="mdi-update"
          inline
          title="AIS Continuous Options"
          class="px-5 py-3 mb-5"
        >
          <v-progress-linear
            v-if="aisOptionsLoading"
            indeterminate
          />
          <v-divider class="mt-3 mb-5" />
          <v-simple-table>
            <thead>
              <tr>
                <th class="text-left">
                  Option
                </th>
                <th class="text-center">
                  Type
                </th>
                <th class="text-center">
                  Update Interval in Minutes
                </th>
                <th class="text-center">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(ais, index) in aisOptions"
                :key="index"
              >
                <td class="text-left">
                  {{ ais.name }}
                </td>
                <td class="text-center">
                  {{ ais.type }}
                </td>
                <td class="text-center">
                  <v-radio-group
                    v-if="ais.upper"
                    v-model="ais.value"
                    row
                  >
                    <v-radio
                      label="Hourly"
                      value="hourly"
                      color="warning"
                    />
                    <v-radio
                      label="Daily"
                      value="daily"
                      color="warning"
                    />
                  </v-radio-group>
                  <v-text-field
                    v-else
                    v-model="ais.value"
                    hide-details
                    single-line
                    style="max-width: 100px; margin: auto; padding: 0;"
                  />
                </td>
                <td class="text-center">
                  <v-btn
                    small
                    text
                    fab
                    @click="updateGlobalAis(ais.value, ais.identifier, ais.upper, ais.type)"
                  >
                    <v-icon>mdi-content-save</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </base-material-card>
        <base-material-card
          color="success"
          icon="mdi-map-marker-path"
          inline
          title="AIS Historical Track Options"
          class="px-5 py-3 mb-5"
        >
          <v-progress-linear
            v-if="aisUpdateOptionsLoading"
            indeterminate
          />
          <v-divider class="mt-3 mb-5" />
          <v-simple-table>
            <thead>
              <tr>
                <th class="text-left">
                  Option
                </th>
                <th class="text-center">
                  Update Interval in Days
                </th>
                <th class="text-center">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(ais, index) in aisUpdateOptions"
                :key="index"
              >
                <td class="text-left">
                  {{ ais.name }}
                </td>
                <td class="text-center">
                  <v-radio-group
                    v-if="ais.upper"
                    v-model="ais.value"
                    row
                  >
                    <v-radio
                      label="Hourly"
                      value="hourly"
                      color="warning"
                    />
                    <v-radio
                      label="Daily"
                      value="daily"
                      color="warning"
                    />
                  </v-radio-group>
                  <v-text-field
                    v-else
                    v-model="ais.value"
                    hide-details
                    single-line
                    style="max-width: 100px; margin: auto; padding: 0;"
                  />
                </td>
                <td class="text-center">
                  <v-btn
                    small
                    text
                    fab
                    @click="updateGlobalAis(ais.value, ais.identifier, ais.upper, ais.type, true)"
                  >
                    <v-icon>mdi-content-save</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </base-material-card>
        <base-material-card
          color="error"
          icon="mdi-reload-alert"
          inline
          title="Continuous Updates Enabled - Single Vessels"
          class="px-5 py-3 mb-5"
        >
          <v-progress-linear
            v-if="contLoading"
            indeterminate
          />
          <v-data-table
            :headers="contHeaders"
            :items="continuousVessels"
          >
            <template v-slot:body="{ items }">
              <tbody>
                <tr
                  v-for="(continuousVessel, i) in items"
                  :key="i"
                >
                  <td>
                    <router-link :to="`/vessels/${continuousVessel.id}/ais`">
                      {{ continuousVessel.name }}
                    </router-link>
                  </td>
                  <td>
                    {{ continuousVessel.ais_timestamp }}
                  </td>
                  <td>
                    {{ continuousVessel.zone_name }}
                  </td>
                </tr>
              </tbody>
            </template>
          </v-data-table>
        </base-material-card>
      </v-col>
      <v-dialog
        v-model="selectAis"
        max-width="370"
      >
        <v-card>
          <v-card-title
            class="primary white--text"
          >
            Bulk AIS Options
          </v-card-title>
          <v-card-text class="px-7 py-3">
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              :return-value.sync="aisDate"
              transition="scale-transition"
              offset-y
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="aisDate"
                  label="Select Date UTC (Optional)"
                  prepend-icon="mdi-calendar"
                  readonly
                  clearable
                  hide-details
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="aisDate"
                color="primary"
                no-title
                class="datepicker-width"
              >
                <v-spacer />
                <v-btn
                  text
                  @click="menu = false"
                >
                  Cancel
                </v-btn>
                <v-btn
                  text
                  @click="$refs.menu.save(aisDate)"
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>
          </v-card-text>
          <v-card-text class="px-7 py-3">
            <v-menu
              ref="menu1"
              v-model="menu1"
              :close-on-content-click="false"
              :return-value.sync="aisTime"
              transition="scale-transition"
              offset-y
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="aisTime"
                  label="Select Time UTC (Optional)"
                  prepend-icon="mdi-clock"
                  readonly
                  clearable
                  hide-details
                  v-on="on"
                />
              </template>
              <v-time-picker
                v-if="menu1"
                v-model="aisTime"
                color="primary"
                no-title
                class="datepicker-width"
              >
                <v-spacer />
                <v-btn
                  text
                  color="primary"
                  @click="menu1 = false"
                >
                  Cancel
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.menu1.save(aisTime)"
                >
                  OK
                </v-btn>
              </v-time-picker>
            </v-menu>
          </v-card-text>
          <v-card-text
            v-for="(choice, k) in bulkAisOptions"
            :key="k"
            class="px-1 py-2"
          >
            <v-btn
              text
              block
              class="ma-0 justify-start"
              @click="selectAis = false, getCost(choice, 0)"
            >
              <v-icon left>
                {{ choice.icon }}
              </v-icon>
              {{ choice.name }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
  import axios from 'axios'
  import { mapActions, mapState } from 'vuex'
  import { fleetItemsDownload } from '@/mixins/menuItemsDownload/fleetItemsDownload'
  import { networkItemsDownload } from '@/mixins/menuItemsDownload/networkItemsDownload'
  import { adminDutyNasa } from '@/shared/management'

  export default {
    name: 'AIS',
    mixins: [
      fleetItemsDownload,
      networkItemsDownload,
    ],
    data: () => ({
      request: null,
      networkId: 0,
      networkLoading: false,
      fleetLoading: false,
      contLoading: false,
      aisOptionsLoading: false,
      aisUpdateOptionsLoading: false,
      fleetId: 0,
      pollType: 0,
      selectAis: false,
      continuousVessels: [],
      aisOptions: [],
      aisUpdateOptions: [],
      contHeaders: [
        { text: 'Vessel Name', value: 'name' },
        { text: 'AIS Last Update', value: 'ais_timestamp' },
        { text: 'Zone', value: 'zone_name' },
      ],
      bulkAisOptions: [
        { name: 'Simple Response (terrestrial-AIS) Position', pollType: 3, icon: 'mdi-radio-tower', extended: 0, satellite: 0 },
        { name: 'Simple Response (satellite-AIS) Position', pollType: 4, icon: 'mdi-satellite-variant', extended: 0, satellite: 1 },
      ],
      condition: 1,
      terPosInt: 0,
      satPosInt: 0,
      interval: 0,
      menu: false,
      aisDate: '',
      aisTime: '',
      credits: 0,
      menu1: false,
      fetchingCredits: false,
    }),
    computed: {
      ...mapState({
        extendedNetworkItems (state) {
          return state.menuitems.networkItems
        },
        extendedFleetItems (state) {
          return state.menuitems.fleetItems
        },
        role: state => state.authentication.role,
      }),
    },
    mounted () {
      this.getContVessels()
      this.getAisOptions()
      this.fetchCredits()
    },
    methods: {
      ...mapActions({
        showSnackBar: 'showSnackBar',
      }),
      getContVessels () {
        this.contLoading = true
        axios.get('ais/vessels').then(res => {
          this.continuousVessels = res.data
          this.contLoading = false
        })
      },
      getAisOptions () {
        this.aisOptionsLoading = true
        this.aisUpdateOptionsLoading = true
        axios.get('ais/settings').then(res => {
          this.aisOptions = [
            { name: 'Terrestrial Positions Continuous', type: 'Single Vessel', value: res.data.terrestrial_positions_interval_single, identifier: 'terrestrial_positions_interval_single' },
            { name: 'Terrestrial Positions Continuous', type: 'Network and Fleets', value: res.data.terrestrial_positions_interval_batch, identifier: 'terrestrial_positions_interval_batch' },
            { name: 'Satellite Positions Continuous', type: 'Single Vessel', value: res.data.satellite_positions_interval_single, identifier: 'satellite_positions_interval_single' },
            { name: 'Satellite Positions Continuous', type: 'Network and Fleets', value: res.data.satellite_positions_interval_batch, identifier: 'satellite_positions_interval_batch' },
          ]
          this.aisUpdateOptions = [
            { name: 'Historical Track Lookback', value: res.data.historical_track_days_all, identifier: 'historical_track_days_all', type: 'Track' },
            { name: 'Historical Track Period', value: res.data.historical_track_period_all, upper: true, identifier: 'historical_track_period_all', type: 'Track' },
          ]
          this.terPosInt = res.data.terrestrial_positions_interval_batch
          this.satPosInt = res.data.satellite_positions_interval_batch
          this.aisOptionsLoading = false
          this.aisUpdateOptionsLoading = false
        })
      },
      addAisPoll (resource, network, satellite, pollType) {
        if (!adminDutyNasa(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        if (!resource.ter_status && !resource.sat_status) {
          this.condition = 0
        }
        satellite ? this.interval = this.satPosInt : this.interval = this.terPosInt
        if (network) {
          this.networkId = resource.id
          this.networkLoading = true
        } else {
          this.fleetId = resource.id
          this.fleetLoading = true
        }
        this.request = { network, satellite, condition: this.condition, id: resource.id }
        this.condition ? this.getCost(pollType, 1) : this.addContinuous()
      },
      addContinuous () {
        if (!adminDutyNasa(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        axios.post('ais/getaisbulkpositioncont', this.request)
          .then(res => {
            if (res.data.success) {
              this.showSnackBar({ text: res.data.message, color: 'success' })
            } else {
              this.showSnackBar({ text: res.data.message, color: 'warning' })
            }
            this.request.network ? this.$store.dispatch('getNetworkItems') : this.$store.dispatch('getFleetItems')
            this.getContVessels()
            this.deleteAll()
          })
      },
      updateGlobalAis (value, identifier, upperOrLower, type, track) {
        if (!adminDutyNasa(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        if (!upperOrLower && parseFloat(value) < 10 && !track && type === 'Network and Fleets') {
          return this.showSnackBar({ text: 'Interval less than 10 minutes is not allowed.', color: 'warning' })
        }
        if (!upperOrLower && parseFloat(value) < 2 && !track && type === 'Single Vessel') {
          return this.showSnackBar({ text: 'Interval less than 2 minutes is not allowed.', color: 'warning' })
        } else {
          this.aisOptionsLoading = true
          const request = { [identifier]: upperOrLower ? value.toLowerCase() : parseFloat(value) }
          axios.post('ais/settings', request)
            .then(res => {
              res.data.success
                ? this.showSnackBar({ text: res.data.message, color: 'success' })
                : this.showSnackBar({ text: 'Something unexpected happened', color: 'warning' })
              this.aisOptionsLoading = false
            })
        }
      },
      getCost (item, onceOrCont) {
        if (!adminDutyNasa(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        const pollType = onceOrCont ? item : item.pollType
        axios.post('ais/getcostaispoll', { network_ids: this.networkId && [this.networkId], fleet_ids: this.fleetId && [this.fleetId], type: pollType })
          .then(res => {
            if (!res.data.vessel_count) {
              this.showSnackBar({ text: 'This item has no vessels.', color: 'warning' })
              this.deleteAll()
            } else {
              const message = onceOrCont
                ? `This bulk AIS action will cost approximately $${res.data.cost.toFixed(2)} every ${this.interval} minutes. Would you like to proceed?`
                : `This bulk AIS action will cost approximately $${res.data.cost.toFixed(2)}. Would you like to proceed?`
              this.$confirm(message, { title: 'Warning' }).then(res => {
                if (res) {
                  onceOrCont ? this.addContinuous() : this.getBulkAIS(item)
                } else {
                  this.deleteAll()
                }
              })
            }
          })
      },
      getBulkAIS (item) {
        if (!adminDutyNasa(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        this.networkId ? this.networkLoading = true : this.fleetLoading = true
        const request = { network: this.networkId, id: this.networkId || this.fleetId, extended: item.extended, satellite: item.satellite, last_update: this.aisDate + ' ' + this.aisTime }
        axios.post('ais/getaisbulkposition', request)
          .then(res => {
            res.data.success
              ? this.showSnackBar({ text: res.data.message, color: 'success' })
              : this.showSnackBar({ text: res.data.message, color: 'warning' })
            this.deleteAll()
          })
      },
      async fetchCredits () {
        this.fetchingCredits = true
        try {
          const credits = await axios.post('ais/getcredit')
          // $0.1 for one credit
          this.credits = credits.data.data[0] * 0.1
        } catch (err) {
          this.showSnackBar({ text: err, color: 'error' })
        }
        this.fetchingCredits = false
      },
      deleteAll () {
        this.networkId ? this.$store.dispatch('getNetworkItems') : this.$store.dispatch('getFleetItems')
        this.networkId = 0
        this.fleetId = 0
        this.networkLoading = false
        this.fleetLoading = false
        this.request = null
        this.condition = 1
        this.interval = 0
        this.aisDate = ''
      },
    },
  }
</script>

<style lang="sass">
#ais-table
  .v-input--radio-group__input
    justify-content: center
  .v-input__slot
    justify-content: center
.datepicker-width
  width: 100%
  .v-picker__body
    min-width: 100%
</style>
