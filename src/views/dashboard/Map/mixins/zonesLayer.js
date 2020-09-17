// import axios from 'axios'
import * as L from 'leaflet'
import { toggleSelection } from '../helpers'

export const zonesLayer = {
  data () {
    return {
      sections: [
        {
          id: 'opa_90_zones',
          name: 'OPA-90 Zones',
          icon: 'mdi-map',
          zones: [
            {
              id: 'cotp_zones',
              name: 'COTP Zones',
              checked: false,
              geojson: null,
              url_geojson: 'COTP Zones.geojson',
            },
            {
              id: 'piers',
              name: 'Piers',
              checked: false,
              piers: null,
              url_piers: 'map/piers',
              piersLayer: null,
            },
            {
              id: 'nearshore',
              name: 'Nearshore (12NM)',
              checked: false,
              geojson: null,
              url_geojson: 'Nearshore (12NM).geojson',
            },
            {
              id: 'offshore',
              name: 'Offshore (50NM)',
              checked: false,
              geojson: null,
              url_geojson: 'Offshore (50NM).geojson',
            },
            {
              id: 'us_maritime_limits_and_boundaries',
              name: 'U.S. Maritime Limits and Boundaries',
              checked: false,
              geojson: null,
              url_geojson: 'U.S. Maritime Limits and Boundaries.geojson',
            },
          ],
        },
        {
          id: 'us_maritime_boundaries',
          name: 'US Maritime Boundaries',
          icon: 'mdi-map',
          zones: [
            {
              id: 'territorial_sea',
              name: 'Territorial Sea',
              checked: false,
              geojson: null,
              url_geojson: 'Territorial Sea.geojson',
            },
            {
              id: 'contiguous_zone',
              name: 'Contiguous Zone',
              checked: false,
              geojson: null,
              url_geojson: 'Contiguous Zone.geojson',
            },
            {
              id: 'us_maritime_boundaries_and_limits',
              name: 'U.S. Maritime Boundaries and Limits',
              checked: false,
              geojson: null,
              url_geojson: 'U.S. Maritime Limits and Boundaries.geojson',
            },
          ],
        },
      ],
      selectedZones: [],
      piersCanvasLayer: null,
    }
  },

  computed: {
    geoJsonOptions () {
      return {
        onEachFeature: (feature, layer) => {
          if (feature.zoneId === 'cotp_zones') {
            layer.on('click', () => {
              this.openInfoDrawer({
                id: feature.id,
                type: 'cotp',
              })
            })
          }
        },
      }
    },
  },

  methods: {
    /**
     * if zone.url_geojson -> fetch('/storage/{}') -> l-geo-json
     * else if zone.url_piers -> axios.get('{}') -> ejukeCanvasLayer
     */
    toggleZone (zone) {
      if (!zone) return

      if ('url_geojson' in zone) {
        if (zone.geojson) {
          this.toggleGeoJsonLayer(zone)
        } else {
          this.loading++
          fetch(`/storage/${zone.url_geojson}`)
            .then(res => res.json())
            .then(json => {
              this.loading--
              json.features.forEach((feature, id) => {
                feature.id = id
                feature.zoneId = zone.id
              })
              zone.geojson = json
              this.toggleGeoJsonLayer(zone)
            })
            .catch(err => {
              this.loading--
              this.showSnackBar({ text: err, color: 'error' })
            })
        }
      } else if ('url_piers' in zone) {
        if (zone.piers) {
          this.togglePiersLayer(zone)
        } else {
          // axios.get(zone.url_piers)
          //   .then(res => {
          //     zone.piers = res.data
          //     this.togglePiersLayer(zone)
          //   })
          //   .catch(err => {
          //     this.showSnackBar({ text: err, color: 'error' })
          //   })
          this.loading++
          fetch('/storage/Piers.json')
            .then(res => res.json())
            .then(json => {
              this.loading--
              zone.piers = json
              this.togglePiersLayer(zone)
            })
            .catch(err => {
              this.loading--
              this.showSnackBar({ text: err, color: 'error' })
            })
        }
      }
    },

    /**
     * toggle the switch of l-geo-json on the menu and from/into selectedZones
     */
    toggleGeoJsonLayer (geojsonZone) {
      geojsonZone.checked = !geojsonZone.checked
      this.selectedZones = toggleSelection(this.selectedZones, geojsonZone)
    },

    /**
     * toggle piersLayer on the map
     */
    togglePiersLayer (piersZone) {
      piersZone.checked = !piersZone.checked
      if (piersZone.checked) {
        this.renderPiersLayer(piersZone)
      } else {
        this.piersCanvasLayer.remove()
      }
    },

    /**
     * render piers canvas layer
     */
    renderPiersLayer (piersZone) {
      const icon = L.icon({
        iconUrl: require('@/assets/icons/pier.png'),
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      })

      const markerForPiersCanvasLayer = (lng, pier, index) => {
        return L.marker(
          [pier.lat, lng],
          {
            icon,
            id: pier.id,
            markerId: index,
          },
        ).bindTooltip(pier.name)
      }

      const markers = []
      piersZone.piers.forEach((pier, index) => {
        markers.push(markerForPiersCanvasLayer(pier.lng, pier, index))
        markers.push(markerForPiersCanvasLayer(pier.lng - 360, pier, index))
      })

      this.piersCanvasLayer = L.ejukeCanvasLayer({}).addTo(this.map)
      this.piersCanvasLayer.addLayers(markers)

      this.piersCanvasLayer.addOnClickListener((e, data) => {
        this.openInfoDrawer({
          id: data[0].data.options.id,
          type: 'pier',
        })
      })
      this.piersCanvasLayer.addOnHoverListener(() => {})
    },
  },
}
