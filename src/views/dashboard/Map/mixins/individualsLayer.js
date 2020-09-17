import axios from 'axios'
import * as L from 'leaflet'

export const individualsLayer = {
  data: function () {
    return {
      displayOptions: {
        individuals: true,
        individualsGroup: true,
      },
      individualsClusterLayer: null,
      individualsCanvasLayer: null,
      individualMouseOveredLayer: null,
      individuals: [],
    }
  },

  mounted () {
    this.individualMouseOveredLayer = L.layerGroup()
    this.individualsClusterLayer = L.markerClusterGroup({ disableClusteringAtZoom: 8 })
  },

  methods: {
    /**
     * get individuals data from api and render layers
     */
    getAndRenderIndividuals () {
      this.loading++

      const filters = {
        networks: this.selectedNetworks,
        smff_selected: this.smffFilter.selected,
        smff_operator: this.smffFilter.operator,
      }

      axios.get(`/map/individuals/${JSON.stringify(filters)}`)
        .then(res => {
          this.individuals = res.data.data
        })
        .catch((err) => {
          this.individuals = []
          this.showSnackBar({
            text: `${err} while downloading individuals data`,
            color: 'error',
          })
        })
        .finally(() => {
          this.loading--
          try {
            this.renderIndividualsClusterLayer()
            this.renderIndividualsCanvasLayer()
          } catch (err) {
            // console.log(err)
          }
        })
    },

    /**
     * @param {Object} individual company data
     * @return {L.marker} marker for cluster layer
     */
    markerForIndividualsClusterLayer (individual) {
      return L.marker(
        L.latLng(individual.latlng),
        {
          renderer: this.addressRenderer,
          radius: 5,
          icon: this.getPrimaryServiceIcon('individuals', individual.primary_service),
        },
      )
        .bindTooltip(individual.text)
        .on('click', () => this.openInfoDrawer({
          id: individual.user_id,
          type: 'individual',
          addressId: individual.id,
          name: individual.text,
        }))
    },

    /**
     * @param {Object} company
     * @param {Number} index
     * @return {L.marker} marker for canvas layer
     */
    markerForIndividualsCanvasLayer (individual, index) {
      return L.marker(L.latLng(individual.latlng), {
        renderer: this.addressRenderer,
        radius: 5,
        icon: this.getPrimaryServiceIcon('individuals', individual.primary_service),
        individualId: individual.user_id,
        id: individual.id,
        name: individual.text,
        markerId: index,
      })
    },

    /**
     * render cluster layer for grouped layer
     */
    renderIndividualsClusterLayer () {
      // clear cluster layer
      if (this.map.hasLayer(this.individualsClusterLayer)) {
        this.map.removeLayer(this.individualsClusterLayer)
      }
      this.individualsClusterLayer.clearLayers()

      // add markers to cluster layer
      this.individuals.forEach(individual => {
        this.markerForIndividualsClusterLayer(individual)
          .addTo(this.individualsClusterLayer)
        this.markerForIndividualsClusterLayer({
          ...individual,
          latlng: [individual.latlng[0], individual.latlng[1] - 360],
        }).addTo(this.individualsClusterLayer)
      })

      // add cluster layer
      if (
        this.displayOptions.individuals &&
        this.displayOptions.individualsGroup &&
        this.individualsClusterLayer
      ) {
        this.map.addLayer(this.individualsClusterLayer)
      }
    },

    /**
     * render canvas layer for ungrouped layer
     */
    renderIndividualsCanvasLayer () {
      // clear canvas layer
      if (this.map.hasLayer(this.individualsCanvasLayer)) {
        this.map.removeLayer(this.individualsCanvasLayer)
      }
      this.individualsCanvasLayer = L.canvasIconLayer({})

      // add marker to canvas layer
      this.individuals.forEach((individual, index) => {
        this.markerForIndividualsCanvasLayer(individual, index)
          .addTo(this.individualsCanvasLayer)
        this.markerForIndividualsCanvasLayer(
          {
            ...individual,
            latlng: [individual.latlng[0], individual.latlng[1] - 360],
          },
          index,
        ).addTo(this.individualsCanvasLayer)
      })

      // add click listener
      this.individualsCanvasLayer.addOnClickListener((e, individual) => {
        this.openInfoDrawer({
          id: individual.options.individualId,
          type: 'individual',
          addressId: individual.options.id,
          name: individual.options.name,
        })
      })

      // add hover listener
      this.individualsCanvasLayer.addOnHoverListener((e, data) => {
        const individual = this.individuals[data.options.markerId]
        if (this.individualIdMouseOvered === individual.user_id) return
        this.individualIdMouseOvered = individual.user_id
        this.individualMouseOveredLayer.clearLayers()
        const marker = L.marker(L.latLng(individual.latlng), {
          renderer: this.addressRenderer,
          radius: 5,
          icon: this.getPrimaryServiceIcon('individuals', individual.primary_service),
        })
          .addTo(this.individualMouseOveredLayer)
          .on('mouseover', () => {
            marker.bindTooltip(individual.text).openTooltip()
          })
          .on('mouseout', () => {
            marker.closeTooltip()
            this.individualMouseOveredLayer.clearLayers()
            this.individualIdMouseOvered = null
          })
      })

      // redraw the canvas layer
      this.individualsCanvasLayer.redraw()

      // add canvas layer to map
      if (
        this.displayOptions.individuals &&
        !this.displayOptions.individualsGroup
      ) {
        if (this.individualsCanvasLayer) this.map.addLayer(this.individualsCanvasLayer)
        if (this.individualMouseOveredLayer) this.map.addLayer(this.individualMouseOveredLayer)
      }
    },

    /**
     * manage individuals layers
     */
    manageIndividualsLayers () {
      this.manageLayers(
        this.individualsClusterLayer,
        this.individualsCanvasLayer,
        this.individualMouseOveredLayer,
        this.displayOptions.individuals,
        this.displayOptions.individualsGroup,
      )
    },
  },
  watch: {
    'displayOptions.individuals' () {
      this.manageIndividualsLayers()
    },
    'displayOptions.individualsGroup' () {
      this.manageIndividualsLayers()
    },
  },
}
