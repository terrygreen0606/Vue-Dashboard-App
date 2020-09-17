import { velocityLayer } from 'leaflet'
import 'leaflet-velocity/dist/leaflet-velocity.min'
import { toggleLayer } from '../helpers'

export const windLayer = {
  data: function () {
    return {
      displayOptions: {
        wind: false,
      },
      windLayer: null,
    }
  },
  watch: {
    'displayOptions.wind' (value) {
      if (!this.windLayer && value) {
        this.loading++
        fetch('/storage/wind-global.json')
          .then(res => res.json())
          .then(res => {
            this.windLayer = velocityLayer({
              displayValues: true,
              displayOptions: {
                velocityType: 'Wind',
                emptyString: 'No wind data',
                displayEmptyString: 'No wind data',
                angleConvention: 'bearingCW',
                speedUnit: 'kt',
              },
              data: res,
            })
            this.loading--
            toggleLayer(this.map, this.windLayer, value)
          })
          .catch(err => {
            this.loading--
            this.showSnackBar({
              text: `${err} while downloading wind data`,
              color: 'error',
            })
          })
      } else if (this.windLayer) {
        toggleLayer(this.map, this.windLayer, value)
      }
    },
  },
}
