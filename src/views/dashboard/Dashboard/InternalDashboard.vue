<template>
  <v-row>
    <v-col cols="12">
      <base-material-card
        icon="mdi-earth"
        title="Top Countries by Vessel Count"
      >
        <v-row>
          <v-col
            cols="12"
            md="6"
            class="mt-10"
          >
            <v-simple-table
              class="ml-2"
            >
              <tbody>
                <tr
                  v-for="(data, i) in tableData"
                  :key="i"
                >
                  <td>
                    <flag
                      :iso="data.code"
                      :squared="false"
                      :title="data.country"
                    />
                  </td>
                  <td v-text="data.country" />
                  <td v-text="data.vessels" />
                  <td v-text="data.percent.toFixed(2) + '%'" />
                </tr>
              </tbody>
            </v-simple-table>
          </v-col>

          <v-col
            cols="12"
            md="6"
          >
            <!-- <v-world-map
              :country-data="topCountries"
              high-color="#838383"
              low-color="#BBBBBB"
            /> -->
            <div id="chartdiv" />
          </v-col>
        </v-row>
      </base-material-card>
    </v-col>

    <v-col
      v-for="item in cnt"
      :key="item.title"
      cols="12"
      sm="6"
      lg="3"
    >
      <base-material-stats-card
        :color="item.color"
        :icon="item.icon"
        :title="item.title"
        :value="`+${item.value}`"
        sub-icon="mdi-clock"
        sub-text="Just Updated"
      />
    </v-col>

    <v-col
      cols="12"
      md="6"
    >
      <base-material-card
        icon="mdi-chart-pie"
        title="Vessels by Plan Preparer"
      >
        <v-progress-linear
          v-if="loading"
          indeterminate
        />
        <apexchart
          v-else
          type="pie"
          :options="{...pieChartOptions, ...{ labels: preparerLabels }}"
          :series="preparerSeries"
        />
      </base-material-card>
    </v-col>

    <v-col
      cols="12"
      md="6"
    >
      <base-material-card
        icon="mdi-chart-pie"
        title="Tank / Non-Tank Vessels"
      >
        <v-progress-linear
          v-if="loading"
          indeterminate
        />
        <apexchart
          v-else
          type="pie"
          :options="{...pieChartOptions, ...{ labels: tankLabels }}"
          :series="tankSeries"
        />
      </base-material-card>
    </v-col>

    <v-col
      cols="12"
      lg="4"
    >
      <base-material-card
        icon="mdi-chart-gantt"
        title="Vessel Count By Region"
      >
        <v-progress-linear
          v-if="loading"
          indeterminate
        />
        <apexchart
          v-else
          :options="{...barChartOptions, ...{xaxis: {categories: regionVesselLabels}}}"
          :series="regionVesselSeries"
        />
      </base-material-card>
    </v-col>

    <v-col
      cols="12"
      lg="4"
    >
      <base-material-card
        icon="mdi-chart-pie"
        title="Tonnage By Region"
      >
        <v-progress-linear
          v-if="loading"
          indeterminate
        />
        <apexchart
          v-else
          type="pie"
          :options="{...pieChartOptions, ...{ labels: tonnageLabels }}"
          :series="tonnageSeries"
        />
      </base-material-card>
    </v-col>

    <v-col
      cols="12"
      lg="4"
    >
      <base-material-card
        icon="mdi-chart-gantt"
        title="Ship Count By Region (Excludes Barges)"
      >
        <v-progress-linear
          v-if="loading"
          indeterminate
        />
        <apexchart
          v-else
          :options="{...barChartOptions, ...{xaxis: {categories: regionShipsLabels}}}"
          :series="regionShipsSeries"
        />
      </base-material-card>
    </v-col>
  </v-row>
</template>

<script>
  import axios from 'axios'
  import VueApexCharts from 'vue-apexcharts'
  import * as am4core from '@amcharts/amcharts4/core'
  import * as am4maps from '@amcharts/amcharts4/maps'
  import worldLow from '@amcharts/amcharts4-geodata/worldLow'
  import am4themesAnimated from '@amcharts/amcharts4/themes/animated'
  am4core.useTheme(am4themesAnimated)

  export default {
    name: 'InternalDashboard',

    components: {
      apexchart: VueApexCharts,
    },
    data () {
      return {
        topCountries: {},
        tableData: [],
        cnt: [
          {
            title: 'Companies',
            value: 0,
            color: 'cyan',
            icon: 'mdi-domain',
          },
          {
            title: 'Individuals',
            value: 0,
            color: 'red',
            icon: 'mdi-account-group',
          },
          {
            title: 'Vessels',
            value: 0,
            color: 'green',
            icon: 'mdi-ferry',
          },
          {
            title: 'Fleets',
            value: 0,
            color: 'purple',
            icon: 'mdi-anchor',
          },
        ],
        loading: true,
        pieChartOptions: {
          chart: {
            type: 'pie',
            height: 340,
          },
          legend: { position: 'bottom' },
          // responsive: [
          //   {
          //     breakpoint: 1200,
          //     options: {
          //       chart: {
          //         width: '100%',
          //       },
          //       legend: {
          //         position: 'bottom',
          //       },
          //     },
          //   },
          //   {
          //     breakpoint: 3000,
          //     options: {
          //       chart: {
          //         width: 300,
          //       },
          //       legend: {
          //         position: 'bottom',
          //       },
          //     },
          //   },
          // ],
          colors: ['#00A3E4', '#023B68', '#726A95', '#C32F27', '#1E972D', '#FF8500'],
        },
        barChartOptions: {
          chart: {
            type: 'bar',
            height: 292,
            toolbar: { show: false },
          },
          plotOptions: {
            bar: {
              horizontal: true,
              distributed: true,
            },
          },
          dataLabels: {
            enabled: false,
          },
          xaxis: {
            categories: [],
          },
          colors: ['#00A3E4', '#023B68', '#726A95', '#C32F27', '#1E972D', '#FF8500'],
        },
        preparerLabels: [],
        preparerSeries: [],
        regionVesselLabels: [],
        regionVesselSeries: [],
        regionShipsLabels: [],
        regionShipsSeries: [],
        tonnageLabels: [],
        tonnageSeries: [],
        tankLabels: ['Tank Vessels', 'Non-Tank Vessels'],
        tankSeries: [],
      }
    },

    mounted () {
      this.$nextTick(() => {
        this.loading = true
        axios.get('/dashboard')
          .then(res => {
            this.$nextTick(() => {
              /* Country Map */
              const countryVesselCount = res.data.result.top_countries
              const temp = {}
              countryVesselCount
                .slice(0, 6)
                .sort((a, b) => b.vessels - a.vessels)
                .forEach(vessel => {
                  temp[vessel.country_code] = Number(vessel.vessels)
                  this.tableData.push({
                    code: vessel.country_code,
                    country: vessel.country_name,
                    vessels: vessel.vessels,
                    percent: vessel.percent,
                  })
                })
              this.topCountries = temp
              this.drawDensityMap()
              /* Country Map */

              /* Numbers of Nodes */
              this.cnt[0].value = res.data.result.companies
              this.cnt[1].value = res.data.result.individuals
              this.cnt[2].value = res.data.result.vessels
              this.cnt[3].value = res.data.result.fleets
              /* Numbers of Nodes */

              /* Plan Preparer Pie Chart */
              res.data.result.plan_preparer
                .forEach(item => {
                  this.preparerLabels.push(item.plan_preparer)
                  this.preparerSeries.push(item.percent)
                })
              /* Plan Preparer Pie Chart */

              /* Tank / Non-Tank Pie Chart */
              this.tankSeries = [res.data.result.planType[0].vessels, res.data.result.planType[1].vessels]
              /* Tank / Non-Tank Pie Chart */

              /* Region Vessels Horizontal Bar Chart */
              this.regionVesselLabels = res.data.result.regionVessels.map(vessel => vessel.region)
              this.regionVesselSeries.push({ name: 'Vessels', data: res.data.result.regionVessels.map(vessel => vessel.vessels) })
              /* Region Vessels Horizontal Bar Chart */

              /* Region Ships Horizontal Bar Chart */
              this.regionShipsLabels = res.data.result.regionShips.map(ship => ship.region)
              this.regionShipsSeries.push({ name: 'Ships', data: res.data.result.regionShips.map(ship => ship.ships) })
              /* Region Ships Horizontal Bar Chart */

              /* Tonnage Pie Chart */
              res.data.result.regionTonnage
                .forEach(item => {
                  this.tonnageLabels.push(item.region)
                  this.tonnageSeries.push(parseFloat(item.tonnage))
                })
              /* Tonnage Pie Chart */
            })
          })
          .catch(err => {
            this.showSnackBar({ text: err, color: 'error' })
          })
          .finally(() => {
            this.loading = false
          })
      })
    },

    beforeDestroy () {
      if (this.chart) {
        this.chart.dispose()
      }
    },

    methods: {
      drawDensityMap () {
        if (this.$route.path !== '/') return

        const normalColor = 220
        const densityColors = [0, 1, 2, 3, 4, 5].map(i => 90 + i * 20)
        const diff = 15

        this.chart = am4core.create('chartdiv', am4maps.MapChart)
        this.chart.geodata = worldLow
        this.chart.projection = new am4maps.projections.Miller()

        // world map series
        const worldSeries = this.chart.series.push(new am4maps.MapPolygonSeries())
        worldSeries.name = 'world'
        worldSeries.useGeodata = true
        worldSeries.exclude = ['AQ']

        // world map tooltip
        const worldTemplate = worldSeries.mapPolygons.template
        worldTemplate.tooltipText = '{name}'
        worldTemplate.fill = am4core.color(this.makeColor(normalColor))

        // Create hover state and set alternative fill color
        const hs = worldTemplate.states.create('hover')
        hs.properties.fill = am4core.color(this.makeColor(normalColor + diff))

        Object.keys(this.topCountries).forEach((key, i) => {
          // create top countries series
          const colorSeries = this.chart.series.push(new am4maps.MapPolygonSeries())
          colorSeries.name = key
          colorSeries.useGeodata = true
          colorSeries.include = [key]
          // colorSeries.fill = am4core.color(colors[i])
          // colorSeries.mapPolygons.template.fill = am4core.color(colors[i])

          // top countries tooltip
          const colorTemplate = colorSeries.mapPolygons.template
          colorTemplate.tooltipText = '{name}'
          colorTemplate.fill = am4core.color(this.makeColor(densityColors[i]))

          // Create hover state and set alternative fill color
          const hs = colorTemplate.states.create('hover')
          hs.properties.fill = am4core.color(this.makeColor(densityColors[i] + diff))
        })

        this.chart.zoomControl = new am4maps.ZoomControl()
      },

      makeColor (value) {
        const c = value.toString(16)
        return `#${c}${c}${c}`
      },
    },
  }
</script>

<style lang="sass">
  .ct-label
    fill: white
    opacity: 1 !important
  .apexcharts-canvas
    margin: auto
  .vue-world-map > #map-svg
    max-height: 350px
  #chartdiv
    height: 100%
</style>
