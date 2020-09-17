import { velocityLayer } from 'leaflet'
import '../plugins/leaflet-velocity'
import { toggleLayer, sleep } from '../helpers'
import axios from 'axios'
import moment from 'moment'

const LIMIT_DAYS = 3

export const weatherLayer = {
  data: () => ({
    weatherItems: [
      {
        name: 'wind',
        icon: 'mdi-weather-windy',
        label: 'Show Wind',
      },
      {
        name: 'wave',
        icon: 'mdi-waves',
        label: 'Show Waves',
      },
      {
        name: 'tmp',
        icon: 'mdi-hydraulic-oil-temperature',
        label: 'Show Temperature',
      },
    ],
    displayOptions: {
      wind: false,
      wave: false,
      tmp: false,
    },
    windLayer: null,
    waveLayer: null,
    tmpLayer: null,
    datetimeInt: 0,
    selectedWeather: null,
    weatherCall: null,
    settimeoutId: null,
  }),

  computed: {
    datetimeIntMax () {
      return (LIMIT_DAYS * 2 + 1) * 24 - 1
    },
  },

  watch: {
    'displayOptions.wind' (value) {
      toggleLayer(this.map, this.windLayer, value)
    },

    'displayOptions.wave' (value) {
      toggleLayer(this.map, this.waveLayer, value)
    },

    'displayOptions.tmp' (value) {
      toggleLayer(this.map, this.tmpLayer, value)
    },

    datetimeInt () {
      if (this.settimeoutId) clearTimeout(this.settimeoutId)

      this.settimeoutId = setTimeout(() => {
        this.getWeatherInfoFromApi()
        this.settimeoutId = null
      }, 10)
    },
  },

  mounted () {
    this.windLayer = this.createVelocityLayer('WIND')
    this.waveLayer = this.createVelocityLayer('WAVE')

    // fetch('/storage/wave-global.json')
    // .then(res => res.json())
    // .then(res => {
    //   this.waveLayer = velocityLayer({
    //     displayValues: true,
    //     displayOptions: {
    //       velocityType: 'WAVE',
    //       emptyString: 'No wave data',
    //       displayEmptyString: 'No wave data',
    //       angleConvention: 'bearingCW',
    //       speedUnit: 'kt',
    //     },
    //     data: res,
    //   })
    // })

    // this.$nextTick(() => {
    //   this.map.on('moveend', () => {
    //     if (this.selectedWeather) {
    //       this.getWeatherInfoFromApi()
    //     }
    //   })
    // })
  },

  created () {
    this.LIMIT_DAYS = LIMIT_DAYS
  },

  methods: {
    createVelocityLayer (type, data) {
      return velocityLayer({
        displayValues: true,
        displayOptions: {
          velocityType: type,
          emptyString: `No ${type} data`,
          displayEmptyString: `No ${type} data`,
          angleConvention: 'bearingCW',
          speedUnit: 'kt',
        },
        data,
      })
    },

    onWeatherItemsChanged (itemName) {
      this.weatherItems.forEach(item => {
        item.name !== itemName
          ? this.displayOptions[item.name] = false
          : this.displayOptions[item.name] = !this.displayOptions[item.name]
      })
      if (this.displayOptions[itemName]) {
        if (!this.selectedWeather) {
          this.datetimeInt = this.getInitialDatetimeInt()
        }
        this.selectedWeather = itemName
        this.getWeatherInfoFromApi()
      } else {
        this.selectedWeather = null
      }
    },

    async getWeatherInfoFromApi () {
      if (this.weatherCall) {
        this.weatherCall.cancel()
        await sleep(10)
      }

      const bounds = this.map.getBounds()
      const payload = {
        bounds: {
          lo1: bounds._southWest.lng,
          la1: bounds._southWest.lat,
          lo2: bounds._northEast.lng,
          la2: bounds._northEast.lat,
        },
        type: this.selectedWeather,
        datetime: this.getDatetimeFromInt(this.datetimeInt, true),
      }

      this.weatherCall = axios.CancelToken.source()

      axios.get(
        `map/weather/${JSON.stringify(payload)}`,
        { cancelToken: this.weatherCall.token },
      )
        .then(res => {
          this[`${this.selectedWeather}Layer`].setData(res.data.data)
        })
        .catch(err => {
          if (!axios.isCancel(err)) {
            this.showSnackBar({ text: err, color: 'error' })
          }
        })
        .finally(() => {
          this.weatherCall = null
        })
    },

    /**
     * default: not utc
     * LIMIT_DAYS = 3
     * 0 ~ 167
     * 0 -> 00h 3 days ago
     * 72 -> 00h of today
     * 167 -> 23h of 3 days after
     *
     * if utc: used for api
     * not: for ui
     *
     * @param {integer} value
     * @return {string} datetime
     */
    getDatetimeFromInt (value, utc = false) {
      const datetime = moment()
        .subtract(LIMIT_DAYS, 'days')
        .hour(0).minute(0).second(0)
        .add(value, 'hours')
      return utc
        ? {
          date: moment.utc(datetime).format('YYYY-MM-DD'),
          hour: moment.utc(datetime).format('HH'),
        }
        : datetime.format('YYYY-MM-DD HH').concat('h')
    },

    getInitialDatetimeInt () {
      return LIMIT_DAYS * 24 + moment().hour()
    },

    decrementDatetimeInt () {
      if (this.datetimeInt > 0) this.datetimeInt--
    },

    incrementDatetimeInt () {
      if (this.datetimeInt < this.datetimeIntMax) this.datetimeInt++
    },
  },
}
