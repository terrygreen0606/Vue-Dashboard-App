<template>
  <div
    class="cop-map-container"
  >
    <div
      v-if="loading"
      class="cop-map-loading-container"
    >
      <v-progress-circular
        size="64"
        color="secondary"
        class="cop-map-loading"
        indeterminate
      />
    </div>
    <info-drawer
      :options.sync="infoDrawerOptions"
      :features="infoDrawerOptions.type === 'cotp' ? sections[0].zones[0].geojson.features : null"
      @get-and-render-vessel-track="getAndRenderVesselTrack"
      @draw:updated-vessel-on-map="drawUpdatedVesselOnMap"
    />
    <v-card
      flat
      class="map-container ma-0"
    >
      <l-map
        id="map"
        ref="map"
        class="leaflet-map"
        :options="mapOptions"
      >
        <l-control-zoom position="topright" />
        <l-control-scale
          :imperial="true"
          :metric="true"
          position="bottomright"
        />
        <l-control-layers position="topright" />
        <l-tile-layer
          v-for="tileProvider in tileProviders"
          :key="tileProvider.name"
          :name="tileProvider.name"
          :visible="tileProvider.visible"
          :url="tileProvider.url"
          :attribution="tileProvider.attribution"
          :layer-type="tileProvider.layerType"
        />
        <l-wms-tile-layer
          name="Nautical Charts"
          base-url="https://seamlessrnc.nauticalcharts.noaa.gov/arcgis/services/RNC/NOAA_RNC/ImageServer/WMSServer"
          layers="0"
          format="image/png"
          transparent
          layer-type="overlay"
          attribution="NOAA"
          :visible="false"
        />
        <l-geo-json
          v-for="zone in selectedZones"
          :key="zone.id"
          :geojson="zone.geojson"
          :options="geoJsonOptions"
        />

        <!-- drop marker layer -->
        <l-layer-group
          :visible="displayOptions.drop && !loading"
        >
          <l-marker
            v-for="drop in drops.editedData"
            :key="drop.id"
            :lat-lng="[drop.latitude, drop.longitude]"
            :draggable="drops.edit"
            :visible="drop.state !== 'DELETED'"
            @click="handleDropClick(drop)"
            @update:lat-lng="latlng => handleDropLatLngUpdate(latlng, drop)"
          >
            <l-tooltip>
              <b>Title: </b>{{ drop.title }}<br>
              <b>Description: </b>{{ drop.description }}<br>
              <b>Latitude:</b> {{ drop.latitude }}<br>
              <b>Longitude:</b> {{ drop.longitude }}<br>
              <b>Zone:</b> {{ drop.zone }}
            </l-tooltip>
          </l-marker>

          <!-- duplicate markers -->
          <l-marker
            v-for="drop in drops.editedData"
            :key="'d' + drop.id"
            :lat-lng="[drop.latitude, drop.longitude - 360]"
            :draggable="drops.edit"
            :visible="drop.state !== 'DELETED'"
            @click="handleDropClick(drop)"
            @update:lat-lng="latlng => handleDropLatLngUpdate(latlng, drop)"
          >
            <l-tooltip>
              <b>Title: </b>{{ drop.title }}<br>
              <b>Description: </b>{{ drop.description }}<br>
              <b>Latitude:</b> {{ drop.latitude }}<br>
              <b>Longitude:</b> {{ drop.longitude }}<br>
              <b>Zone:</b> {{ drop.zone }}
            </l-tooltip>
          </l-marker>
        </l-layer-group>
      </l-map>

      <!-- drop marker editor -->
      <dialog-drag
        v-if="drops.dropEditorData"
        id="drop-editor"
        :title="drops.dropEditorData.title ? drops.dropEditorData.title : 'Untitled'"
        :options="drops.dropEditorOptions"
        @close="closeDropEditor"
      >
        <!-- delete drop button -->
        <div style="width: 100%; display: flex; flex-direction: row-reverse;">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                style="width: 30px; height: 30px;"
                fab
                small
                color="warning"
                v-on="on"
                @click="handleDeleteDrop"
              >
                <v-icon dark>
                  mdi-delete
                </v-icon>
              </v-btn>
            </template>
            <span>Delete This Drop</span>
          </v-tooltip>
        </div>
        <v-text-field
          v-model="drops.dropEditorData.title"
          label="Title"
          hide-details
          @change="handleDropDataUpdate(drops.dropEditorData)"
        />
        <v-textarea
          v-model="drops.dropEditorData.description"
          label="Description"
          hide-details
          @change="handleDropDataUpdate(drops.dropEditorData)"
        />
        <v-text-field
          v-model="drops.dropEditorData.latitude"
          label="Latitude"
          hide-details
          type="number"
          @change="handleDropDataUpdate(drops.dropEditorData)"
        />
        <v-text-field
          v-model="drops.dropEditorData.longitude"
          label="Longitude"
          hide-details
          type="number"
          @change="handleDropDataUpdate(drops.dropEditorData)"
        />
        <v-text-field
          v-model="drops.dropEditorData.zone"
          label="Zone"
          hide-details
          readonly
        />
      </dialog-drag>

      <v-toolbar
        dense
        floating
        class="ml-2 mr-12 map-toolbar-container"
        dark
      >
        <toolbar-search-autocomplete @handle:searched-item="handleSearchedItem" />
        <v-menu
          bottom
          offset-y
          :close-on-content-click="false"
        >
          <template v-slot:activator="{ on }">
            <v-btn
              class="toolbar-icon-button"
              dark
              icon
              v-on="on"
            >
              <v-icon class="mx-0">
                mdi-filter-menu
              </v-icon>
            </v-btn>
          </template>
          <v-list
            class="cop-map-menu"
            dark
          >
            <v-list-group
              no-action
            >
              <template v-slot:activator>
                <v-icon>
                  mdi-ferry
                </v-icon>
                <v-list-item>
                  Fleets
                </v-list-item>
              </template>
              <v-list-item
                v-for="fleet in fleets"
                :key="fleet.id"
                class="pl-10"
                @click="() => { fleet.checked = !fleet.checked }"
              >
                <v-checkbox
                  v-model="fleet.checked"
                  :label="fleet.name"
                  readonly
                  hide-details
                />
              </v-list-item>
            </v-list-group>
            <v-list-group
              no-action
            >
              <template v-slot:activator>
                <v-icon>
                  mdi-lan
                </v-icon>
                <v-list-item>
                  Networks
                </v-list-item>
              </template>
              <v-list-item
                v-for="network in networks"
                :key="network.id"
                class="pl-10"
                @click="() => { network.checked = !network.checked }"
              >
                <v-checkbox
                  v-model="network.checked"
                  :label="network.name"
                  hide-details
                  readonly
                />
              </v-list-item>
            </v-list-group>
            <v-list-group
              no-action
            >
              <template v-slot:activator>
                <v-icon>
                  mdi-pier-crane
                </v-icon>
                <v-list-item>
                  SMFF Capabilities
                </v-list-item>
              </template>
              <v-list-item class="pl-10">
                <v-radio-group
                  v-model="smffFilter.operator"
                  row
                >
                  <v-radio
                    label="AND"
                    value="and"
                  />
                  <v-radio
                    label="OR"
                    value="or"
                  />
                </v-radio-group>
              </v-list-item>
              <v-list-item class="pl-10">
                <v-autocomplete
                  v-model="smffFilter.selected"
                  :items="serviceItems.filter(item => item.db === 1)"
                  item-text="name"
                  item-value="id"
                  label="SMFF Services"
                  multiple
                  dense
                  hide-details
                  clearable
                />
              </v-list-item>
            </v-list-group>
            <v-list-group
              no-action
            >
              <template v-slot:activator>
                <v-icon>
                  mdi-clock
                </v-icon>
                <v-list-item>
                  Timestamp Filter
                </v-list-item>
              </template>
              <v-list-item
                v-for="(item, i) in TIMESTAMP_FILTERS"
                :key="i"
                class="pl-10"
                @click="() => { timestampFilter = item.value }"
              >
                <v-switch
                  :input-value="timestampFilter === item.value"
                  :label="item.label"
                  readonly
                  hide-details
                />
              </v-list-item>
            </v-list-group>
          </v-list>
        </v-menu>
        <v-menu
          bottom
          offset-y
          :close-on-content-click="false"
        >
          <template v-slot:activator="{ on }">
            <v-btn
              class="toolbar-icon-button"
              dark
              icon
              v-on="on"
            >
              <v-icon class="mx-0">
                mdi-layers
              </v-icon>
            </v-btn>
          </template>
          <v-list
            class="cop-map-menu"
            dark
          >
            <v-list-group
              v-for="section in sections"
              :key="section.id"
              no-action
            >
              <template v-slot:activator>
                <v-icon>
                  {{ section.icon }}
                </v-icon>
                <v-list-item>
                  {{ section.name }}
                </v-list-item>
              </template>
              <v-list-item
                v-for="zone in section.zones"
                :key="zone.id"
                class="pl-10"
                @click="toggleZone(zone)"
              >
                <v-switch
                  v-model="zone.checked"
                  :label="zone.name"
                  readonly
                  hide-details
                />
              </v-list-item>
            </v-list-group>

            <!-- weather items -->
            <v-list-group no-action>
              <template v-slot:activator>
                <v-icon>
                  mdi-weather-partly-snowy-rainy
                </v-icon>
                <v-list-item>
                  Weather
                </v-list-item>
              </template>
              <v-list-item
                v-for="item in weatherItems"
                :key="item.name"
                class="pl-10"
                @click="() => onWeatherItemsChanged(item.name)"
              >
                <v-switch
                  v-model="displayOptions[item.name]"
                  :label="item.label"
                  :prepend-icon="item.icon"
                  readonly
                  hide-details
                />
              </v-list-item>
            </v-list-group>

            <v-list-item
              v-for="item in checksInLayerOptions.items"
              :key="item.name"
              @click="displayOptions[item.name] = !displayOptions[item.name]"
            >
              <v-checkbox
                v-model="displayOptions[item.name]"
                :label="item.label"
                :prepend-icon="item.icon"
                readonly
                hide-details
              />
            </v-list-item>
          </v-list>
        </v-menu>
        <v-menu
          bottom
          offset-y
          :close-on-content-click="false"
        >
          <template v-slot:activator="{ on }">
            <v-btn
              class="toolbar-icon-button"
              dark
              icon
              v-on="on"
            >
              <v-icon class="mx-0">
                mdi-dots-vertical
              </v-icon>
            </v-btn>
          </template>
          <v-list
            class="cop-map-menu"
            dark
          >
            <v-list-group
              no-action
            >
              <template v-slot:activator>
                <v-icon>
                  {{ viewOptions.icon }}
                </v-icon>
                <v-list-item>
                  {{ viewOptions.name }}
                </v-list-item>
              </template>
              <v-list-item
                v-for="item in viewOptions.items"
                :key="item.name"
                class="pl-10"
                @click="displayOptions[item.name] = !displayOptions[item.name]"
              >
                <v-checkbox
                  v-model="displayOptions[item.name]"
                  :label="item.label"
                  :prepend-icon="item.icon"
                  readonly
                  hide-details
                />
              </v-list-item>
            </v-list-group>
            <v-list-group
              no-action
            >
              <template v-slot:activator>
                <v-icon>
                  mdi-content-save
                </v-icon>
                <v-list-item>
                  Saved Places
                </v-list-item>
              </template>
              <v-list-item
                @click="exportPNG"
              >
                Saved Place
              </v-list-item>
            </v-list-group>
            <v-list-group
              no-action
            >
              <template v-slot:activator>
                <v-icon>
                  mdi-share-variant
                </v-icon>
                <v-list-item>
                  Share/Export
                </v-list-item>
              </template>
              <v-list-item
                class="pl-10"
                @click="exportPNG"
              >
                <v-icon class="pr-2">
                  mdi-alpha-p-circle
                </v-icon>
                PNG Format
              </v-list-item>
              <v-list-item
                class="pl-10"
                @click="exportKML"
              >
                <v-icon class="pr-2">
                  mdi-alpha-k-circle
                </v-icon>
                KML Format
              </v-list-item>
            </v-list-group>
            <v-list-item
              v-for="item in checksInOthers.items"
              :key="item.name"
              @click="displayOptions[item.name] = !displayOptions[item.name]"
            >
              <v-checkbox
                v-model="displayOptions[item.name]"
                :label="item.label"
                :prepend-icon="item.icon"
                readonly
                hide-details
              />
            </v-list-item>
          </v-list>
        </v-menu>
        <toolbar-menu-legend />

        <!-- edit drop button -->
        <v-tooltip
          v-if="displayOptions.drop"
          bottom
        >
          <template v-slot:activator="{ on }">
            <v-btn
              class="toolbar-icon-button"
              dark
              icon
              :disabled="drops.edit"
              v-on="on"
              @click="handleEditDrops"
            >
              <v-icon color="warning">
                mdi-pencil
              </v-icon>
            </v-btn>
          </template>
          <span>Edit Drops</span>
        </v-tooltip>
        <!-- Save drops button -->
        <v-tooltip
          v-if="displayOptions.drop"
          bottom
        >
          <template v-slot:activator="{ on }">
            <v-btn
              class="toolbar-icon-button"
              dark
              icon
              :disabled="!drops.edit || drops.saved"
              v-on="on"
              @click="handleSaveDropsChanges"
            >
              <v-icon color="warning">
                mdi-content-save
              </v-icon>
            </v-btn>
          </template>
          <span>Save Drops Changes</span>
        </v-tooltip>
        <!-- cancel editing drop button -->
        <v-tooltip
          v-if="displayOptions.drop"
          bottom
        >
          <template v-slot:activator="{ on }">
            <v-btn
              class="toolbar-icon-button"
              dark
              icon
              :disabled="!drops.edit"
              v-on="on"
              @click="handleDiscardDropsChanges"
            >
              <v-icon color="warning">
                mdi-cancel
              </v-icon>
            </v-btn>
          </template>
          <span>Discard/Cancel Drops Changes</span>
        </v-tooltip>
        <!-- close drop button -->
        <v-tooltip
          v-if="displayOptions.drop"
          bottom
        >
          <template v-slot:activator="{ on }">
            <v-btn
              class="toolbar-icon-button"
              dark
              icon
              v-on="on"
              @click="handleCloseDrops"
            >
              <v-icon color="warning">
                mdi-close
              </v-icon>
            </v-btn>
          </template>
          <span>Close Drops Lat/Lng</span>
        </v-tooltip>

        <!-- close track layer button -->
        <v-tooltip
          v-if="vesselTrack.display"
          bottom
        >
          <template v-slot:activator="{ on }">
            <v-btn
              class="toolbar-icon-button"
              dark
              icon
              v-on="on"
              @click="closeTrackLayer"
            >
              <v-icon color="warning">
                mdi-close
              </v-icon>
            </v-btn>
          </template>
          <span>Close the vessel track</span>
        </v-tooltip>
      </v-toolbar>

      <div
        v-if="selectedWeather"
        class="slider"
      >
        <span>
          {{ getDatetimeFromInt(datetimeInt) }}
        </span>
        <v-slider
          v-model="datetimeInt"
          thumb-color="green lighten-1"
          :max="datetimeIntMax"
          hide-details
        >
          <template v-slot:prepend>
            <v-icon
              color="white"
              @click="decrementDatetimeInt"
            >
              mdi-minus
            </v-icon>
          </template>
          <template v-slot:append>
            <v-icon
              color="white"
              @click="incrementDatetimeInt"
            >
              mdi-plus
            </v-icon>
          </template>
        </v-slider>
      </div>

      <!-- save confirmation dialog -->
      <confirm-dialog
        :show="drops.confirmDialogModel"
        :title="confirmDialogTitle"
        :close-text="confirmDialogCloseText"
        @close:dialog="() => { drops.confirmDialogModel = false }"
        @discard:changes="discardChanges"
      />
    </v-card>
  </div>
</template>

<script>
  import * as Vue2Leaflet from 'vue2-leaflet'
  import axios from 'axios'
  import download from 'downloadjs'
  import * as L from 'leaflet'
  import { GestureHandling } from 'leaflet-gesture-handling'
  // import 'leaflet-easyprint'
  import 'leaflet-graticule'
  import 'leaflet-rotatedmarker'
  import 'leaflet.markercluster'
  import './plugins/leaflet.canvas-markers'
  import './plugins/ejuke.canvas-layer'
  import { serviceItems } from '@/mixins/serviceItems'
  import { mapActions } from 'vuex'
  // import { windLayer } from './mixins/windLayer'
  // import { waveLayer } from './mixins/waveLayer'
  import { weatherLayer } from './mixins/weatherLayer'
  import { gridLayer } from './mixins/gridLayer'
  import { vesselsLayer } from './mixins/vesselsLayer'
  import { individualsLayer } from './mixins/individualsLayer'
  import { companiesLayer } from './mixins/companiesLayer'
  import { zonesLayer } from './mixins/zonesLayer'
  import { controls } from './mixins/controls'
  import { ruler } from './mixins/ruler'
  import { dropMarker } from './mixins/dropMarker'
  import { vesselTrackLayer } from './mixins/vesselTrackLayer'
  import { tileProviders } from './helpers'

  L.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling)

  const TIMESTAMP_FILTERS = [
    { value: 'D', label: '1 DAY' },
    { value: 'W', label: '1 WEEK' },
    { value: 'M', label: '1 MONTH' },
    { value: 'A', label: 'ALL' },
  ]

  export default {
    components: {
      LMap: Vue2Leaflet.LMap,
      LTileLayer: Vue2Leaflet.LTileLayer,
      'l-wms-tile-layer': Vue2Leaflet.LWMSTileLayer,
      LControlZoom: Vue2Leaflet.LControlZoom,
      LControlScale: Vue2Leaflet.LControlScale,
      LControlLayers: Vue2Leaflet.LControlLayers,
      LGeoJson: Vue2Leaflet.LGeoJson,
      LLayerGroup: Vue2Leaflet.LLayerGroup,
      LMarker: Vue2Leaflet.LMarker,
      LTooltip: Vue2Leaflet.LTooltip,
      InfoDrawer: () => import('./components/InfoDrawer/Index'),
      ToolbarSearchAutocomplete: () => import('./components/ToolbarSearchAutocomplete'),
      ToolbarMenuLegend: () => import('./components/ToolbarMenuLegend'),
      DialogDrag: () => import('vue-dialog-drag'),
      ConfirmDialog: () => import('@/views/dashboard/components/ConfirmDialog'),
    },

    mixins: [
      serviceItems,
      // windLayer,
      // waveLayer,
      weatherLayer,
      gridLayer,
      vesselsLayer,
      individualsLayer,
      companiesLayer,
      zonesLayer,
      controls,
      ruler,
      dropMarker,
      vesselTrackLayer,
    ],

    data: () => ({
      map: null,
      tileProviders,
      displayOptions: {
        draw: false,
      },
      showMapMenu: false,
      search: '',
      fleets: [],
      networks: [],
      smffFilter: {
        operator: 'and',
        selected: [],
      },
      timestampFilter: TIMESTAMP_FILTERS[3].value,
      // easyPrinter: null,
      infoDrawerOptions: {
        id: 0,
        type: '',
        addressId: null,
        name: '',
        show: false,
        temporary: true,
      },
      vesselIdMouseOvered: null,
      loading: 0,
      capabilitiesCodeSet: null,
    }),

    computed: {
      mapOptions () {
        return {
          zoomControl: false,
          zoom: 2,
          maxZoom: 20,
          maxBounds: [[-90, -540], [90, 180]],
          gestureHandling: L.Browser.mobile,
        }
      },

      selectedNetworks () {
        return this.networks
          .filter(network => network.checked)
          .map(network => network.id)
      },

      selectedFleets () {
        return this.fleets
          .filter(fleet => fleet.checked)
          .map(fleet => fleet.id)
      },
    },

    watch: {
      smffFilter: {
        handler: function (value) {
          this.getAndRenderVessels()
          this.getAndRenderCompanies()
          this.getAndRenderIndividuals()
        },
        deep: true,
      },

      selectedNetworks: {
        handler: function (value) {
          this.getAndRenderVessels()
          this.getAndRenderIndividuals()
          this.getAndRenderCompanies()
        },
        deep: true,
      },

      selectedFleets: {
        handler: function (value) {
          this.getAndRenderVessels()
        },
        deep: true,
      },

      timestampFilter: function (value) {
        this.getAndRenderVessels()
      },
    },

    created () {
      this.TIMESTAMP_FILTERS = TIMESTAMP_FILTERS
    },

    async mounted () {
      this.map = this.$refs.map.mapObject

      // this.easyPrinter = L.easyPrint({
      //   title: 'Print map',
      //   position: 'topright',
      //   filename: 'CDT_Map',
      //   exportOnly: true,
      //   hideControlContainer: true,
      //   hidden: true,
      // }).addTo(this.map)

      axios.get('map/fleets')
        .then(res => {
          this.fleets = res.data.map(fleet => ({
            ...fleet,
            checked: false,
          }))
        })
        .catch((err) => {
          this.showSnackBar({
            text: `${err} on Fleets Download`,
            color: 'error',
          })
        })
      axios.get('map/networks')
        .then(res => {
          this.networks = res.data.map(network => ({
            ...network,
            checked: false,
          }))
        })
        .catch((err) => {
          this.showSnackBar({
            text: `${err} on Networks Download`,
            color: 'error',
          })
        })

      await this.getCapabilitiesCodeFromApi()

      this.$nextTick(() => {
        this.getAndRenderVessels()
        this.getAndRenderIndividuals()
        this.getAndRenderCompanies()
      })
    },

    methods: {
      ...mapActions({
        showSnackBar: 'showSnackBar',
      }),

      /**
       *
       * get code match for primary_service from API
       * primary_service for individuals and companies
       * from [{ id: 1, code: "s_remote_assessment_and_consultation" }]
       * to { '1': "s_remote_assessment_and_consultation" }
       */
      async getCapabilitiesCodeFromApi () {
        const res = await axios.get('map/capabilities')
        this.capabilitiesCodeSet = res.data.reduce((set, item) => {
          return { ...set, [item.id]: item.code }
        }, {})
      },

      /**
       *
       * @param {String} type ['individuals', 'companies']
       * @param {*} primaryService
       * @returns {L.icon}
       */
      getPrimaryServiceIcon (type, primaryService) {
        const iconName = this.capabilitiesCodeSet[primaryService]
          ? this.capabilitiesCodeSet[primaryService]
          : 'undefined'
        return L.icon({
          iconUrl: require(`@/assets/icons/${type}/${iconName}.png`),
          iconSize: [20, 20],
          iconAnchor: [10, 10],
          popupAnchor: [0, 0],
          className: `icon-${type}`,
        })
      },

      /**
       * handle searchedItem which is searched from toolbar searchbox
       *
       * @param {Object} searchedItem
       */
      handleSearchedItem (searchedItem) {
        if (searchedItem.type === 'location') {
          L.marker([searchedItem.latitude, searchedItem.longitude]).addTo(this.map)
        } else {
          this.openInfoDrawer({
            id: searchedItem.id,
            type: searchedItem.type,
            addressId: searchedItem.address_id,
          })
        }
        this.map.setView(
          [searchedItem.latitude, searchedItem.longitude],
          17,
          { animation: true },
        )
      },

      /**
       * handle layers according to their displayOptions
       */
      manageLayers (clusterLayer, canvasLayer, mouseOveredLayer, show, showGroup) {
        if (show) {
          if (showGroup) {
            if (clusterLayer && !this.map.hasLayer(clusterLayer)) {
              this.map.addLayer(clusterLayer)
            }
            if (canvasLayer && this.map.hasLayer(canvasLayer)) {
              this.map.removeLayer(canvasLayer)
              this.map.removeLayer(mouseOveredLayer)
            }
          } else {
            if (this.map.hasLayer(clusterLayer)) {
              this.map.removeLayer(clusterLayer)
            }
            if (
              canvasLayer &&
              mouseOveredLayer &&
              !this.map.hasLayer(canvasLayer)
            ) {
              this.map.addLayer(canvasLayer)
              this.map.addLayer(mouseOveredLayer)
            }
          }
        } else {
          if (this.map.hasLayer(clusterLayer)) {
            this.map.removeLayer(clusterLayer)
          }
          if (this.map.hasLayer(canvasLayer)) {
            this.map.removeLayer(canvasLayer)
            this.map.removeLayer(mouseOveredLayer)
          }
        }
      },

      closeInfoDrawer () {
        this.infoDrawerOptions.show = false
      },

      openInfoDrawer (options) {
        this.infoDrawerOptions = {
          addressId: null,
          name: '',
          ...options,
          show: true,
          temporary: this.infoDrawerOptions.temporary,
        }
      },

      exportPNG () {
        // this.easyPrinter.printMap('CurrentSize', 'CDT_Map_Export')
      },

      exportKML () {
        const filters = {
          fleets: this.selectedFleets,
          networks: this.selectedNetworks,
          smff_selected: this.smffFilter.selected,
          smff_operator: this.smffFilter.operator,
          timestamp: this.timestampFilter,
          vessels: this.displayOptions.vessels,
          individuals: this.displayOptions.individuals,
          companies: this.displayOptions.companies,
        }

        axios.get(`map/export/CDT.kml/${JSON.stringify(filters)}`, { responseType: 'arraybuffer' })
          .then(res => {
            download(res.data, 'CDT.kml')
            this.showSnackBar({
              text: 'Download started',
              color: 'success',
            })
          }).catch((err) => {
            this.showSnackBar({
              text: `${err} on CDT download`,
              color: 'error',
            })
          })
      },
    },
  }
</script>

<style lang="sass">
  @import "@/sass/leaflet-map-overriding.scss"
  @import "~leaflet.markercluster/dist/MarkerCluster.css"
  @import "~leaflet.markercluster/dist/MarkerCluster.Default.css"
  @import '~leaflet-fullscreen/dist/leaflet.fullscreen.css'
  @import '~leaflet-easybutton/src/easy-button.css'
  @import '~leaflet-velocity/dist/leaflet-velocity.min.css'
  @import '~leaflet-gesture-handling/dist/leaflet-gesture-handling.css'
  @import './plugins/leaflet-ruler/leaflet-ruler.css'

  .cop-map-container
    height: 100%
    display: flex
    #map
      margin: 0
      width: 100%
      height: 100%
      z-index: 0

  .cop-alt-photo
    width: 100%
    height: 160px
    text-align: center
  .cop-info-loading
    left: 50%
    transform: translateX(-16px)

  .cop-map-menu
    background-size: cover
    max-width: 270px
    opacity: .89
    .v-input--hide-details
      margin: 0

  .cop-map-loading-container
    left: 0
    right: 0
    top: 0
    bottom: 0
    position: absolute
    z-index: 99
    .cop-map-loading
      position: absolute
      z-index: 100
      left: 50%
      top: 50%
      transform: translate(-32px, -32px)

  .leaflet-map
    position: absolute
    top: 0

  .map-container
    height: 100%
    width: 100%
    position: relative
    .map-toolbar-container
      margin-top: 10px
      opacity: .89
      box-sizing: border-box !important
      border: 0.5px solid rgba(255, 255, 255, 0.27) !important
      background-color: rgba(30, 43, 81, 0.71) !important
      box-shadow: -2px 2px 2px 0 rgba(0, 0, 0, 0.1) !important
      border-radius: 3px
      height: 36px !important

  .theme--dark.v-text-field > .v-input__control > .v-input__slot:before,
  .v-text-field.v-input--is-focused > .v-input__control > .v-input__slot:after
    transform: translate(0, -5px)

  .v-toolbar--dense .v-toolbar__content, .v-toolbar--dense .v-toolbar__extension
    padding-left: .5rem
    padding-right: 1rem

  .v-toolbar--dense .v-toolbar__content, .v-toolbar--dense .v-toolbar__extension
    height: 36px !important

  .toolbar-icon-button
    height: 36px !important
    width: 36px !important

  .edit-drop-popup
    background: #382382
    .edit-drop-button
      cursor: pointer

  .dialog-drag
    .dialog-header
      background-color: $secondary !important
      .title
        font-size: 1rem !important
      .buttons
        font-size: 1.1rem !important
    &.fixed
      border-color: $primary !important

  .slider
    position: absolute
    padding: 10px 20px 0 20px
    bottom: 60px
    left: 50px
    right: 50px
    background: rgba(30, 43, 81, 0.71)
    border: 1px solid rgba(255, 255, 255, 0.27) !important
    & span
      font-size: 20px
      color: #eee
</style>

<style src="vue-dialog-drag/dist/vue-dialog-drag.css"></style>
