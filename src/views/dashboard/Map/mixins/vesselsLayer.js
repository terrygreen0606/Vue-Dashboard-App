import axios from 'axios'
import * as L from 'leaflet'
import { getVesselIcon } from '../helpers'

export const vesselsLayer = {
  data: function () {
    return {
      displayOptions: {
        vessels: true,
        vesselsGroup: true,
      },
      vesselsClusterLayer: null,
      vesselsCanvasLayer: null,
      vesselMouseOveredLayer: null,
      vessels: [],
      zoomVesselId: null,
    }
  },

  mounted () {
    this.vesselMouseOveredLayer = L.layerGroup()
    this.vesselsClusterLayer = L.markerClusterGroup({ disableClusteringAtZoom: 8 })
  },

  methods: {
    /**
     * get vessels data from api and render layers
     */
    getAndRenderVessels () {
      this.loading++

      const filters = {
        fleets: this.selectedFleets,
        networks: this.selectedNetworks,
        smff_selected: this.smffFilter.selected,
        smff_operator: this.smffFilter.operator,
        timestamp: this.timestampFilter,
      }

      axios.get(`/map/vessels/${JSON.stringify(filters)}`)
        .then(res => {
          this.vessels = res.data
        })
        .catch((err) => {
          this.vessels = []
          this.showSnackBar({
            text: `${err} while downloading vessels data`,
            color: 'error',
          })
        })
        .finally(() => {
          this.loading--
          try {
            this.renderVesselsClusterLayer(this.vessels)
            this.renderVesselsCanvasLayer(this.vessels)
            this.zoomToVessel()
          } catch (err) {}
        })
    },

    /**
     * get tooltip data from api and bind tooltip
     *
     * @param {L.marker} marker
     * @param {Object} vessel
     */
    vesselMarkerMouseover (marker, vessel) {
      if (this.vesselIdMouseOvered === vessel[0]) return
      this.vesselIdMouseOvered = vessel[0]
      axios.get(`map/vessel/${vessel[0]}`)
        .then(res => {
          const data = res.data.data
          const content = `${data.name} [${data.imo || '--'}] / ${data.speed || '--'} knots / ${data.course || '--'}&deg;<br>AIS Status: ${data.nav_status.value}<br>Position received: ${data.timestamp}<br>Destination: ${data.destination || 'Unknown'}<br>ETA: ${data.eta || 'Unknown'}`
          if (this.vesselIdMouseOvered === vessel[0]) {
            marker.bindTooltip(content).openTooltip()
          }
        })
        .catch((err) => {
          if (this.vesselIdMouseOvered === vessel[0]) {
            this.showSnackBar({
              text: `${err} on Vessel Position`,
              color: 'error',
            })
          }
        })
    },

    /**
     * close tooltip and clear layers and id
     *
     * @param {L.marker} marker
     */
    vesselMarkerMouseout (marker) {
      marker.closeTooltip()
      this.vesselMouseOveredLayer.clearLayers()
      this.vesselIdMouseOvered = null
    },

    /**
     * render cluster layer for grouped layer
     */
    renderVesselsClusterLayer (vessels, clear = true) {
      // clear cluster layer
      if (clear) {
        if (this.map.hasLayer(this.vesselsClusterLayer)) {
          this.map.removeLayer(this.vesselsClusterLayer)
        }
        this.vesselsClusterLayer.clearLayers()
      }

      // add markers to cluster layer
      vessels.forEach(vessel => {
        const lngs = [vessel[2], vessel[2] - 360]
        lngs.forEach(lng => {
          const marker = L.marker([vessel[1], lng], {
            icon: getVesselIcon(vessel[5], vessel[4]),
            rotationAngle: vessel[3],
          })
            .addTo(this.vesselsClusterLayer)
            .on('click', () => this.openInfoDrawer({
              id: vessel[0],
              type: 'vessel',
            }))
            .on('mouseover', () => this.vesselMarkerMouseover(marker, vessel))
            .on('mouseout', () => this.vesselMarkerMouseout(marker))
        })
      })

      // add cluster layer
      if (
        clear &&
        this.displayOptions.vessels &&
        this.displayOptions.vesselsGroup &&
        this.vesselsClusterLayer
      ) {
        this.map.addLayer(this.vesselsClusterLayer)
      }
    },

    /**
     * render canvas layer for ungrouped layer
     */
    renderVesselsCanvasLayer (vessels, clear = true) {
      // clear canvas layer
      if (clear) {
        if (this.map.hasLayer(this.vesselsCanvasLayer)) {
          this.map.removeLayer(this.vesselsCanvasLayer)
        }
        this.vesselsCanvasLayer = L.canvasIconLayer({})
      }

      // add marker to canvas layer
      vessels.forEach((vessel, index) => {
        const lngs = [vessel[2], vessel[2] - 360]
        lngs.forEach(lng => {
          const marker = L.marker([vessel[1], lng], {
            icon: getVesselIcon(vessel[5], vessel[4]),
            rotationAngle: vessel[3],
            vesselId: vessel[0],
            markerId: index,
          })
          this.vesselsCanvasLayer.addMarker(marker)
        })
      })

      if (clear) {
        // add click listener
        this.vesselsCanvasLayer.addOnClickListener((e, vessel) => {
          this.openInfoDrawer({
            id: vessel.options.vesselId,
            type: 'vessel',
          })
        })

        // add hover listener
        this.vesselsCanvasLayer.addOnHoverListener((e, v) => {
          const vessel = vessels[v.options.markerId]
          if (this.vesselIdMouseOvered === vessel[0]) return
          this.vesselMouseOveredLayer.clearLayers()
          const marker = L.marker([vessel[1], vessel[2]], {
            icon: getVesselIcon(vessel[5], vessel[4]),
            rotationAngle: vessel[3],
            vesselId: vessel[0],
          })
            .addTo(this.vesselMouseOveredLayer)
            .on('mouseover', () => this.vesselMarkerMouseover(marker, vessel))
            .on('mouseout', () => this.vesselMarkerMouseout(marker))
        })
      }

      // redraw the canvas layer
      this.vesselsCanvasLayer.redraw()

      // add canvas layer to map
      if (
        clear &&
        this.displayOptions.vessels &&
        !this.displayOptions.vesselsGroup
      ) {
        if (this.vesselsCanvasLayer) this.map.addLayer(this.vesselsCanvasLayer)
        if (this.vesselMouseOveredLayer) this.map.addLayer(this.vesselMouseOveredLayer)
      }
    },

    /**
     * manage vessels layers
     */
    manageVesselsLayers () {
      this.manageLayers(
        this.vesselsClusterLayer,
        this.vesselsCanvasLayer,
        this.vesselMouseOveredLayer,
        this.displayOptions.vessels,
        this.displayOptions.vesselsGroup,
      )
    },

    /**
     * if navigated from vessels page through router-link
     * zoom to specific vessel
     */
    zoomToVessel () {
      const id = this.zoomVesselId || Number(this.$route.query.vessel)

      if (id) {
        const vessel = this.vessels.find(vessel => vessel[0] === id)

        if (this.$route.query.vessel) this.$router.replace({ query: null })
        this.zoomVesselId = null

        if (vessel) {
          this.map.setView(L.latLng(vessel[1], vessel[2]), 8)
        }
      }
    },

    drawUpdatedVesselOnMap (updatedVessel) {
      this.zoomVesselId = updatedVessel.id
      this.getAndRenderVessels()
    },
  },

  watch: {
    'displayOptions.vessels' () {
      this.manageVesselsLayers()
    },
    'displayOptions.vesselsGroup' () {
      this.manageVesselsLayers()
    },
    $route (to, from) {
      this.zoomToVessel()
    },
  },
}
