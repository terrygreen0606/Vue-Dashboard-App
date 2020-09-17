import axios from 'axios'
import * as L from 'leaflet'

export const companiesLayer = {
  data: function () {
    return {
      displayOptions: {
        companies: true,
        companiesGroup: true,
      },
      companiesClusterLayer: null,
      companiesCanvasLayer: null,
      companyMouseOveredLayer: null,
      companies: [],
    }
  },

  mounted () {
    this.companyMouseOveredLayer = L.layerGroup()
    this.companiesClusterLayer = L.markerClusterGroup({ disableClusteringAtZoom: 8 })
  },

  methods: {
    /**
     * get companies data from api and render layers
     */
    getAndRenderCompanies () {
      this.loading++

      const filters = {
        networks: this.selectedNetworks,
        smff_selected: this.smffFilter.selected,
        smff_operator: this.smffFilter.operator,
      }

      axios.get(`/map/companies/${JSON.stringify(filters)}`)
        .then(res => {
          this.companies = res.data.data
        })
        .catch((err) => {
          this.companies = []
          this.showSnackBar({
            text: `${err} while downloading companies data`,
            color: 'error',
          })
        })
        .finally(() => {
          this.loading--
          try {
            this.renderCompaniesClusterLayer()
            this.renderCompaniesCanvasLayer()
          } catch (err) {
            // console.log(err)
          }
        })
    },

    /**
     * @param {Object} company company data
     * @return {L.marker} marker for cluster layer
     */
    markerForCompaniesClusterLayer (company) {
      return L.marker(
        L.latLng(company.latlng),
        {
          renderer: this.addressRenderer,
          radius: 5,
          icon: this.getPrimaryServiceIcon('companies', company.primary_service),
        },
      )
        .bindTooltip(company.text)
        .on('click', () => this.openInfoDrawer({
          id: company.company_id,
          type: 'company',
          addressId: company.id,
          name: company.text,
        }))
    },

    /**
     * @param {Object} company
     * @param {Number} index
     * @return {L.marker} marker for canvas layer
     */
    markerForCompaniesCanvasLayer (company, index) {
      return L.marker(
        L.latLng(company.latlng),
        {
          renderer: this.addressRenderer,
          radius: 5,
          icon: this.getPrimaryServiceIcon('companies', company.primary_service),
          companyId: company.company_id,
          id: company.id,
          name: company.text,
          markerId: index,
        },
      )
    },

    /**
     * render cluster layer for grouped layer
     */
    renderCompaniesClusterLayer () {
      // clear cluster layer
      if (this.map.hasLayer(this.companiesClusterLayer)) {
        this.map.removeLayer(this.companiesClusterLayer)
      }
      this.companiesClusterLayer.clearLayers()

      // add markers to cluster layer
      this.companies.forEach(company => {
        this.markerForCompaniesClusterLayer(company)
          .addTo(this.companiesClusterLayer)
        this.markerForCompaniesClusterLayer({
          ...company,
          latlng: [company.latlng[0], company.latlng[1] - 360],
        }).addTo(this.companiesClusterLayer)
      })

      // add cluster layer
      if (
        this.displayOptions.companies &&
        this.displayOptions.companiesGroup &&
        this.companiesClusterLayer
      ) {
        this.map.addLayer(this.companiesClusterLayer)
      }
    },

    /**
     * render canvas layer for ungrouped layer
     */
    renderCompaniesCanvasLayer () {
      // clear canvas layer
      if (this.map.hasLayer(this.companiesCanvasLayer)) {
        this.map.removeLayer(this.companiesCanvasLayer)
      }
      this.companiesCanvasLayer = L.canvasIconLayer({})

      // add marker to canvas layer
        this.companies.forEach((company, index) => {
          this.markerForCompaniesCanvasLayer(company, index)
            .addTo(this.companiesCanvasLayer)
          this.markerForCompaniesCanvasLayer(
            {
              ...company,
              latlng: [company.latlng[0], company.latlng[1] - 360],
            },
            index,
          ).addTo(this.companiesCanvasLayer)
        })

      // add click listener
      this.companiesCanvasLayer.addOnClickListener((e, company) => {
        this.openInfoDrawer({
          id: company.options.companyId,
          type: 'company',
          addressId: company.options.id,
          name: company.options.name,
        })
      })

      // add hover listener
      this.companiesCanvasLayer.addOnHoverListener((e, data) => {
        const company = this.companies[data.options.markerId]
        if (this.companyIdMouseOvered === company.company_id) return
        this.companyIdMouseOvered = company.company_id
        this.companyMouseOveredLayer.clearLayers()
        const marker = L.marker(
          L.latLng(company.latlng),
          {
            renderer: this.addressRenderer,
            radius: 5,
            icon: this.getPrimaryServiceIcon('companies', company.primary_service),
          },
        )
          .addTo(this.companyMouseOveredLayer)
          .on('mouseover', () => {
            marker.bindTooltip(company.text).openTooltip()
          })
          .on('mouseout', () => {
            marker.closeTooltip()
            this.companyMouseOveredLayer.clearLayers()
            this.companyIdMouseOvered = null
          })
      })

      // redraw the canvas layer
      this.companiesCanvasLayer.redraw()

      // add canvas layer to map
      if (
        this.displayOptions.companies &&
        !this.displayOptions.companiesGroup
      ) {
        if (this.companiesCanvasLayer) this.map.addLayer(this.companiesCanvasLayer)
        if (this.companyMouseOveredLayer) this.map.addLayer(this.companyMouseOveredLayer)
      }
    },

    /**
     * manage companies layers
     */
    manageCompaniesLayers () {
      this.manageLayers(
        this.companiesClusterLayer,
        this.companiesCanvasLayer,
        this.companyMouseOveredLayer,
        this.displayOptions.companies,
        this.displayOptions.companiesGroup,
      )
    },
  },
  watch: {
    'displayOptions.companies' () {
      this.manageCompaniesLayers()
    },
    'displayOptions.companiesGroup' () {
      this.manageCompaniesLayers()
    },
  },
}
