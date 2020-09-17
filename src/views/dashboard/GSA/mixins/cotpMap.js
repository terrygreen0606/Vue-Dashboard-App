import * as am4core from '@amcharts/amcharts4/core'
import * as am4maps from '@amcharts/amcharts4/maps'
import am4themesAnimated from '@amcharts/amcharts4/themes/animated'

am4core.useTheme(am4themesAnimated)

export const cotpMap = {
  data: function () {
    return {
      atlanticAreaPanel: -1,
      pacificAreaPanel: -1,
      chart: null,
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initializeCotpMap()
    })
  },
  computed: {
    atlanticAreaPanels () {
      return Object.keys(this.atlanticArea).reduce((panels, key, i) => ({ ...panels, [key]: i }), {})
    },
    pacificAreaPanels () {
      return Object.keys(this.pacificArea).reduce((panels, key, i) => ({ ...panels, [key]: i }), {})
    },
  },
  methods: {
    initializeCotpMap () {
      /* Create map instance */
      this.chart = am4core.create('chartdiv', am4maps.MapChart)

      fetch('/storage/gsa.geojson')
        .then(res => res.json())
        .then(geodata => {
          fetch('/storage/worldHigh.json')
            .then(res => res.json())
            .then(world => {
              const cotpList = geodata.features.map(feature => feature.id)

              /* treat geodata */
              geodata.features.push(...world.features)

              /* Set map definition */
              this.chart.geodata = geodata

              /* Set projection */
              this.chart.projection = new am4maps.projections.Miller()

              /* Create World map excluding US */
              const worldSeries = this.chart.series.push(new am4maps.MapPolygonSeries())
              worldSeries.name = 'Non-US'
              worldSeries.useGeodata = true
              worldSeries.exclude = [...cotpList, 'AQ']
              worldSeries.fill = am4core.color('#444')
              worldSeries.mapPolygons.template.fill = am4core.color('#444')

              /* Create US COTP map */
              const cotpSeries = this.chart.series.push(new am4maps.MapPolygonSeries())
              cotpSeries.name = 'COTP of US'
              cotpSeries.useGeodata = true
              cotpSeries.include = cotpList
              cotpSeries.fill = am4core.color('#74B266')

              // Configure series of COTP
              const cotpTemplate = cotpSeries.mapPolygons.template
              cotpTemplate.tooltipText = '{ZoneName}'
              cotpTemplate.fill = am4core.color('#74B266')
              cotpTemplate.events.on('hit', ev => {
                ev.target.series.chart.zoomToMapObject(ev.target)
                const districtNum = ev.target.dataItem.dataContext.DistrictNa.replace('District ', '')
                this.openPanel(districtNum)
              })

              // Create hover state and set alternative fill color
              const hs = cotpTemplate.states.create('hover')
              hs.properties.fill = am4core.color('#367B25')

              /* Legend */
              this.chart.legend = new am4maps.Legend()
              this.chart.legend.position = 'right'
              this.chart.legend.align = 'right'

              this.chart.zoomControl = new am4maps.ZoomControl()
            })
        })
    },
    openPanel (districtNum) {
      if (districtNum in this.atlanticAreaPanels) {
        this.atlanticAreaPanel = this.atlanticAreaPanels[districtNum]
        this.pacificAreaPanel = null
      }
      if (districtNum in this.pacificAreaPanels) {
        this.pacificAreaPanel = this.pacificAreaPanels[districtNum]
        this.atlanticAreaPanel = null
      }
    },
  },
  beforeDestroy () {
    if (this.chart) {
      this.chart.dispose()
    }
  },
}
