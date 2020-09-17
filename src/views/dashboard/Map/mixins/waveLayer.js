import { velocityLayer } from 'leaflet'
import 'leaflet-velocity/dist/leaflet-velocity.min'
import { toggleLayer } from '../helpers'

export const waveLayer = {
  data: function () {
    return {
      displayOptions: {
        wave: false,
      },
      waveLayer: null,
    }
  },
  watch: {
    'displayOptions.wave' (value) {
      if (!this.waveLayer && value) {
        this.loading++
        fetch('/storage/wave-global.json')
          .then(res => res.json())
          .then(res => {
            this.loading--
            this.waveLayer = velocityLayer({
              displayValues: true,
              displayOptions: {
                velocityType: 'Wave',
                emptyString: 'No wave data',
                displayEmptyString: 'No wave data',
                angleConvention: 'bearingCW',
                speedUnit: 'kt',
              },
              data: res,
            })
            toggleLayer(this.map, this.waveLayer, value)
          })
          .catch(err => {
            this.loading--
            this.showSnackBar({
              text: `${err} on wave download`,
              color: 'error',
            })
          })
      } else if (this.waveLayer) {
        toggleLayer(this.map, this.waveLayer, value)
      }
    },
  },
}
