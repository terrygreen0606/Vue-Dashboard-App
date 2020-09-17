<template>
  <base-material-card
    color="primary"
    class="px-5 py-3"
  >
    <template v-slot:heading>
      <v-tabs
        v-model="aisTabs"
        background-color="transparent"
        slider-color="white"
      >
        <span
          class="subheading font-weight-light mx-3"
          style="align-self: center"
        >AIS Data:</span>
        <v-tab class="mr-3">
          <v-icon class="mr-2">
            mdi-check
          </v-icon>
          Simple
        </v-tab>
        <v-tab class="mr-3">
          <v-icon class="mr-2">
            mdi-check-all
          </v-icon>
          Extended
        </v-tab>
        <v-tab>
          <v-icon class="mr-2">
            mdi-pencil-ruler
          </v-icon>
          Particulars
        </v-tab>
        <v-tab>
          <v-icon class="mr-2">
            mdi-map-marker-path
          </v-icon>
          Track
        </v-tab>
      </v-tabs>
    </template>
    <v-tabs-items
      v-model="aisTabs"
      class="transparent"
    >
      <v-tab-item>
        <v-row v-if="aisdata.position">
          <v-col cols="12">
            <l-map
              v-if="aisdata.position.lat && aisdata.position.lon"
              id="map"
              :zoom="5"
              :center="[aisdata.position.lat, aisdata.position.lon]"
              :options="{ dragging: false, scrollWheelZoom: false, zoomControl: false }"
            >
              <l-control-zoom position="topright" />
              <l-tile-layer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png" />
              <v-rotated-marker
                :lat-lng="[aisdata.position.lat, aisdata.position.lon]"
                :icon="icon"
                :rotation-angle="aisdata.position.status ? 0 : aisdata.position.heading"
              />
            </l-map>
          </v-col>
          <v-col
            v-for="(simple, i) in simpleAIS"
            :key="i"
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="aisdata.position[simple.model]"
              :label="simple.label"
              :prepend-icon="simple.icon"
              readonly
            />
          </v-col>
        </v-row>
        <v-row
          v-else
          class="text-center"
        >
          <v-col cols="12">
            <v-icon size="100">
              mdi-reload-alert
            </v-icon>
          </v-col>
          <v-col cols="12">
            <v-btn
              color="primary"
              min-width="265"
              @click="getAIS(0, 0, 3, 'position')"
            >
              <v-icon left>
                mdi-radio-tower
              </v-icon>
              Terrestrial Simple Response
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-btn
              color="error"
              min-width="265"
              @click="getAIS(0, 1, 4, 'position')"
            >
              <v-icon left>
                mdi-satellite-variant
              </v-icon>
              Satellite Simple Response
            </v-btn>
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item>
        <v-row v-if="aisdata.position">
          <v-col
            v-for="(extended, j) in extendedAIS"
            :key="j"
            cols="12"
            sm="6"
          >
            <v-text-field
              v-if="extended.model === 'flag'"
              v-model="(countryItems.find(c =>
                c.id === aisdata.position[extended.model]
              ) || {}).name"
              :label="extended.label"
              :prepend-icon="extended.icon"
              readonly
            />
            <v-text-field
              v-else
              v-model="aisdata.position[extended.model]"
              :label="extended.label"
              :prepend-icon="extended.icon"
              readonly
            />
          </v-col>
        </v-row>
        <v-row
          v-else
          class="text-center"
        >
          <v-col cols="12">
            <v-icon size="100">
              mdi-reload-alert
            </v-icon>
          </v-col>
          <v-col cols="12">
            <v-btn
              color="primary"
              min-width="280"
              @click="getAIS(1, 0, 5, 'position')"
            >
              <v-icon left>
                mdi-radio-tower
              </v-icon>
              Terrestrial Extended Response
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-btn
              color="error"
              min-width="280"
              @click="getAIS(1, 1, 6, 'position')"
            >
              <v-icon left>
                mdi-satellite-variant
              </v-icon>
              Satellite Extended Response
            </v-btn>
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item>
        <v-row v-if="aisdata.particular">
          <v-col
            v-for="(particular, k) in particulars"
            :key="k"
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="aisdata.particular[particular.model]"
              :label="particular.label"
              :prepend-icon="particular.icon"
              readonly
            />
          </v-col>
        </v-row>
        <v-row
          v-else
          class="text-center"
        >
          <v-col cols="12">
            <v-icon size="100">
              mdi-reload-alert
            </v-icon>
          </v-col>
          <v-col cols="12">
            <v-btn
              color="primary"
              @click="getAIS(0, 0, 1, 'particular')"
            >
              <v-icon left>
                mdi-pencil-ruler
              </v-icon>
              Particulars
            </v-btn>
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item>
        <v-row v-if="aisdata.historical_track">
          <l-map
            id="track-map"
            :options="mapOptions"
          >
            <l-control-zoom position="topright" />
            <l-tile-layer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png" />
            <l-polyline
              :lat-lngs="polylineLatLngs"
              color="red"
            />
            <v-rotated-marker
              v-for="data in aisdata.historical_track"
              :key="data.id"
              :lat-lng="[data.lat, data.lon]"
              :icon="getIcon(aisdata.vessel_type, data.status)"
              :rotation-angle="data.status ? 0 : data.heading"
            >
              <l-tooltip>
                <b>Course: </b>{{ data.course }}&deg;<br>
                <b>Heading: </b>{{ data.heading }}&deg;<br>
                <b>Latitude: </b>{{ data.lat }}<br>
                <b>Longitude: </b>{{ data.lon }}<br>
                <b>MMSI: </b>{{ data.mmsi }}<br>
                <b>Timestamp: </b>{{ data.timestamp }}<br>
                <b>Zone: </b>{{ getZoneName(data.zone_id) }}
              </l-tooltip>
            </v-rotated-marker>
          </l-map>
        </v-row>
        <v-row
          v-else
          class="text-center"
        >
          <v-col cols="12">
            <v-icon size="100">
              mdi-reload-alert
            </v-icon>
          </v-col>
          <v-col cols="12">
            <v-btn
              color="primary"
              min-width="265"
              @click="getAIS(0, 0, 1, 'track')"
            >
              <v-icon left>
                mdi-radio-tower
              </v-icon>
              Simple Terrestrial Track
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-btn
              color="error"
              min-width="265"
              @click="getAIS(0, 1, 1, 'track')"
            >
              <v-icon left>
                mdi-satellite-variant
              </v-icon>
              Simple Satellite Track
            </v-btn>
          </v-col>
        </v-row>
      </v-tab-item>
    </v-tabs-items>
  </base-material-card>
</template>

<script>
  import { LMap, LTileLayer, LPolyline, LTooltip, LControlZoom } from 'vue2-leaflet'
  import { Browser, Map } from 'leaflet'
  import { getVesselIcon } from '../../Map/helpers'
  import { zoneItemsDownload } from '@/mixins/menuItemsDownload/zoneItemsDownload'
  import { countryItemsDownload } from '@/mixins/menuItemsDownload/countryItemsDownload'
  import { GestureHandling } from 'leaflet-gesture-handling'
  import { mapState } from 'vuex'
  import { checkCUD } from '@/shared/management'

  Map.addInitHook('addHandler', 'gestureHandling', GestureHandling)

  export default {
    name: 'SingleAis',
    components: {
      LMap,
      LTileLayer,
      LPolyline,
      LTooltip,
      LControlZoom,
      'v-rotated-marker': () => import('vue2-leaflet-rotatedmarker'),
    },
    mixins: [
      zoneItemsDownload,
      countryItemsDownload,
    ],
    props: {
      aisdata: {
        type: Object,
        default: () => ({}),
      },
    },
    data: () => ({
      loading: 0,
      zone: null,
      next_port: '',
      last_port: '',
      current_port: '',
      aisTabs: 0,
      simpleAIS: [
        { label: 'Latitude', model: 'lat', icon: 'mdi-latitude' },
        { label: 'Longitude', model: 'lon', icon: 'mdi-longitude' },
        { label: 'Timestamp', model: 'timestamp', icon: 'mdi-map-clock' },
        { label: 'Speed', model: 'speed', icon: 'mdi-speedometer' },
        { label: 'Course', model: 'course', icon: 'mdi-chart-line-variant' },
        { label: 'Heading', model: 'heading', icon: 'mdi-compass' },
        { label: 'Navigation Status', model: 'nav_status_value', icon: 'mdi-reload-alert' },
        { label: 'Last Data Source', model: 'dsrc', icon: 'mdi-satellite' },
      ],
      extendedAIS: [
        { label: 'Vessel Name', model: 'shipname', icon: 'mdi-ferry' },
        { label: 'IMO', model: 'imo', icon: 'mdi-fingerprint' },
        { label: 'Vessel Type ID', model: 'shiptype', icon: 'mdi-tag' },
        { label: 'Call Sign', model: 'callsign', icon: 'mdi-radio' },
        { label: 'Vessel Type', model: 'type_name', icon: 'mdi-playlist-check' },
        { label: 'Vessel Type Summary', model: 'ais_type_summary', icon: 'mdi-details' },
        { label: 'Vessel Flag', model: 'flag', icon: 'mdi-flag' },
        { label: 'Current Port', model: 'current_port', icon: 'mdi-map-check' },
        { label: 'Last Port', model: 'last_port', icon: 'mdi-minus' },
        { label: 'Last Port Call', model: 'last_port_time', icon: 'mdi-map-clock' },
        { label: 'Destination', model: 'destination', icon: 'mdi-island' },
        { label: 'Next Port', model: 'next_port_name', icon: 'mdi-skip-next' },
        { label: 'ETA per AIS', model: 'eta', icon: 'mdi-send-clock' },
        { label: 'ETA per Calculations', model: 'eta_calc', icon: 'mdi-send-check' },
        { label: 'LOA (m)', model: 'length', icon: 'mdi-ruler' },
        { label: 'Breadth (m)', model: 'width', icon: 'mdi-ruler-square' },
        { label: 'Draught (m x 10)', model: 'draught', icon: 'mdi-wave' },
        { label: 'GRT', model: 'grt', icon: 'mdi-dumbbell' },
        { label: 'DWT (t)', model: 'dwt', icon: 'mdi-weight' },
        { label: 'Year Built', model: 'year_built', icon: 'mdi-calendar-multiple-check' },
      ],
      particulars: [
        { label: 'MMSI', model: 'mmsi', icon: 'mdi-antenna' },
        { label: 'IMO', model: 'imo', icon: 'mdi-fingerprint' },
        { label: 'Name', model: 'name', icon: 'mdi-ferry' },
        { label: 'Place of Build', model: 'place_of_build', icon: 'mdi-hammer-screwdriver' },
        { label: 'Build', model: 'build', icon: 'mdi-calendar-multiple-check' },
        { label: 'Breadth Extreme', model: 'breadth_extreme', icon: 'mdi-ruler-square' },
        { label: 'Summer DWT', model: 'summer_dwt', icon: 'mdi-weight' },
        { label: 'Displacement Summer', model: 'displacement_summer', icon: 'mdi-water-polo' },
        { label: 'Call Sign', model: 'callsign', icon: 'mdi-radio' },
        { label: 'Flag', model: 'flag', icon: 'mdi-flag' },
        { label: 'Draught', model: 'draught', icon: 'mdi-wave' },
        { label: 'Length Overall', model: 'length_overall', icon: 'mdi-ruler' },
        { label: 'Fuel Consumption', model: 'fuel_consumption', icon: 'mdi-gas-station' },
        { label: 'Speed Max', model: 'speed_max', icon: 'mdi-speedometer' },
        { label: 'Speed Service', model: 'speed_service', icon: 'mdi-speedometer-medium' },
        { label: 'Liquid Oil', model: 'liquid_oil', icon: 'mdi-water' },
        { label: 'Owner', model: 'owner', icon: 'mdi-domain' },
        { label: 'Manager', model: 'manager', icon: 'mdi-domain' },
        { label: 'Vessel Type', model: 'vessel_type', icon: 'mdi-tag' },
        { label: 'Manager and Owner', model: 'manager_owner', icon: 'mdi-domain' },
      ],
    }),
    computed: {
      ...mapState({
        role: state => state.authentication.role,
      }),
      icon () {
        return getVesselIcon(this.aisdata.vessel_type, this.aisdata.position.status)
      },

      mapOptions () {
        return {
          zoomControl: false,
          zoom: 2,
          maxZoom: 20,
          maxBounds: [[-90, -180], [90, 180]],
          gestureHandling: Browser.mobile,
        }
      },

      polylineLatLngs () {
        return this.aisdata.historical_track.map(track => [track.lat, track.lon])
      },
    },
    watch: {
      aisdata (val) {
        // Uncomment the if-else statements if loading status is asked to do
        // if (Object.keys(val).length) {
        //   this.loading = false
        //   return val
        // } else {
        //   this.loading = true
        // }
        if (val.position) {
          if (val.position.zone_id) {
            for (let i = 0; i < this.zoneItems.length; i++) {
              if (val.position.zone_id === this.zoneItems[i].id) {
                this.zone = this.zoneItems[i].name
              }
            }
          } else if (val.position.zone_name) {
            this.zone = val.position.zone_name
          } else {
            this.zone = 'Outside US EEZ'
          }
          if (val.position.ports) {
            if (val.position.ports.last_port) {
              this.last_port = val.position.ports.last_port.name
            }
            if (val.position.ports.current_port) {
              this.current_port = val.position.ports.current_port.name
            }
            if (val.position.ports.next_port) {
              this.next_port = val.position.ports.next_port.name
            }
          }
        }
        return val
      },
    },

    methods: {
      getZoneName (zoneId) {
        const outside = 'Outside US EEZ'
        return zoneId
          ? (this.zoneItems.find(zone => zone.id === zoneId) || {}).name || outside
          : outside
      },

      getAIS (extended, satellite, pollType, flag) {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        // flag is for identifying which response to fetch
        // flag : 'position', 'particular', 'track'
        this.$emit('getAIS', extended, satellite, pollType, flag)
      },

      getIcon (vesselType, aisStatus) {
        return getVesselIcon(vesselType, aisStatus)
      },
    },
  }
</script>

<style lang="sass" scoped>
  @import '~leaflet-gesture-handling/dist/leaflet-gesture-handling.css'

  #track-map
    margin-top: 1rem
    margin-bottom: 1rem
    height: 400px
    width: 100%
    z-index: 0
</style>
