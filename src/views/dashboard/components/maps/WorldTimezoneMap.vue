<template>
  <div
    id="chartdiv-world-timezone-map"
    class="timezone-map"
    :class="{'timezone-sm-and-down': $vuetify.breakpoint.smAndDown, 'timezone-sm-and-up': $vuetify.breakpoint.smAndUp }"
  />
</template>

<script>
  import * as am4core from '@amcharts/amcharts4/core'
  import * as am4maps from '@amcharts/amcharts4/maps'
  import am4themesAnimated from '@amcharts/amcharts4/themes/animated'
  import worldTimeZoneAreasHigh from '@amcharts/amcharts4-geodata/worldTimeZoneAreasHigh'
  import worldTimeZonesHigh from '@amcharts/amcharts4-geodata/worldTimeZonesHigh'

  am4core.useTheme(am4themesAnimated)

  export default {
    data: () => ({
      chart: null,
    }),

    mounted () {
      this.$nextTick(() => {
        /**
         * ---------------------------------------
         * This demo was created using amCharts 4.
         *
         * For more information visit:
         * https://www.amcharts.com/
         *
         * Documentation is available at:
         * https://www.amcharts.com/docs/v4/
         * ---------------------------------------
         */

        // Create map instance
        this.chart = am4core.create('chartdiv-world-timezone-map', am4maps.MapChart)
        // Set map definition
        this.chart.geodata = worldTimeZoneAreasHigh
        // Set projection
        this.chart.projection = new am4maps.projections.Orthographic()
        this.chart.panBehavior = 'rotateLongLat'

        // var startColor = this.chart.colors.getIndex(0)
        // var middleColor = this.chart.colors.getIndex(7)
        // var endColor = this.chart.colors.getIndex(14)

        var interfaceColors = new am4core.InterfaceColorSet()

        // Create map polygon series
        var polygonSeries = this.chart.series.push(new am4maps.MapPolygonSeries())
        // Make map load polygon (like country names) data from GeoJSON
        polygonSeries.useGeodata = true
        polygonSeries.calculateVisualCenter = true

        var polygonTemplate = polygonSeries.mapPolygons.template
        polygonTemplate.fillOpacity = 0.6
        polygonTemplate.nonScalingStroke = true
        polygonTemplate.strokeWidth = 1
        polygonTemplate.stroke = interfaceColors.getFor('background')
        polygonTemplate.strokeOpacity = 1

        polygonTemplate.adapter.add('fill', (fill, target) => {
          if (target.dataItem.index > 0) {
            return this.chart.colors.getIndex(target.dataItem.index)
          }
          return fill
        })
        /// add country borders
        // Create map polygon series
        /*
        var countrySeries = this.chart.series.push(new am4maps.MapPolygonSeries());
        // Make map load polygon (like country names) data from GeoJSON
        countrySeries.useGeodata = true;
        countrySeries.geodata = am4geodata_worldLow;

        var countryPolygonTemplate = countrySeries.mapPolygons.template;
        countryPolygonTemplate.fillOpacity = 0;
        countryPolygonTemplate.nonScalingStroke = true;
        countryPolygonTemplate.strokeWidth = 1;
        countryPolygonTemplate.stroke = interfaceColors.getFor("background");
        countryPolygonTemplate.strokeOpacity = 0.3;
        */

        // Create map polygon series
        var boundsSeries = this.chart.series.push(new am4maps.MapPolygonSeries())
        boundsSeries.geodata = worldTimeZonesHigh
        boundsSeries.useGeodata = true
        boundsSeries.mapPolygons.template.fill = am4core.color(
          interfaceColors.getFor('alternativeBackground'),
        )
        boundsSeries.mapPolygons.template.fillOpacity = 0.07
        boundsSeries.mapPolygons.template.nonScalingStroke = true
        boundsSeries.mapPolygons.template.strokeWidth = 0.5
        boundsSeries.mapPolygons.template.strokeOpacity = 1
        boundsSeries.mapPolygons.template.stroke = interfaceColors.getFor('background')
        boundsSeries.tooltipText = '{id}'

        var hs = polygonTemplate.states.create('hover')
        hs.properties.fillOpacity = 1

        var bhs = boundsSeries.mapPolygons.template.states.create('hover')
        bhs.properties.fillOpacity = 0.3

        polygonSeries.mapPolygons.template.events.on('over', function (event) {
          var polygon = boundsSeries.getPolygonById(event.target.dataItem.dataContext.id)
          if (polygon) {
            polygon.isHover = true
          }
        })

        polygonSeries.mapPolygons.template.events.on('out', function (event) {
          var polygon = boundsSeries.getPolygonById(event.target.dataItem.dataContext.id)
          if (polygon) {
            polygon.isHover = false
          }
        })

        var labelSeries = this.chart.series.push(new am4maps.MapImageSeries())
        var label = labelSeries.mapImages.template.createChild(am4core.Label)
        label.text = '{id}'
        label.strokeOpacity = 0
        label.fill = am4core.color('#000000')
        label.horizontalCenter = 'middle'
        label.fontSize = 9
        label.nonScaling = true

        labelSeries.mapImages.template.adapter.add('longitude', (longitude, target) => {
          target.zIndex = 100000

          var polygon = polygonSeries.getPolygonById(target.dataItem.dataContext.id)
          if (polygon) {
            return polygon.visualLongitude
          }
          return longitude
        })

        labelSeries.mapImages.template.adapter.add('latitude', (latitude, target) => {
          var polygon = polygonSeries.getPolygonById(target.dataItem.dataContext.id)
          if (polygon) {
            return polygon.visualLatitude
          }
          return latitude
        })

        var button = this.chart.createChild(am4core.SwitchButton)
        button.align = 'right'
        button.marginTop = 0
        button.marginRight = 20
        button.valign = 'top'
        button.leftLabel.text = 'Globe'
        button.rightLabel.text = 'Map'

        button.events.on('toggled', () => {
          this.chart.deltaLatitude = 0
          this.chart.deltaLongitude = 0
          this.chart.deltaGamma = 0

          if (button.isActive) {
            this.chart.projection = new am4maps.projections.Miller()
            this.chart.panBehavior = 'move'
          } else {
            this.chart.projection = new am4maps.projections.Orthographic()
            this.chart.panBehavior = 'rotateLongLat'
          }
        })

        polygonSeries.events.on('datavalidated', function () {
          labelSeries.data = polygonSeries.data
        })
      })
    },

    beforeDestroy () {
      if (this.chart) {
        this.chart.dispose()
      }
    },
  }
</script>

<style lang="scss" scoped>
  .timezone-map {
    width: 100%;
  }
  .timezone-sm-and-down {
    height: 90vw;
  }
  .timezone-sm-and-up {
    height: 45vw;
  }
</style>
