import { Control } from 'leaflet'
import '../plugins/leaflet-ruler/leaflet-ruler'

export const ruler = {
  data () {
    return {
      rulerControl: null,
      displayOptions: {
        ruler: false,
      },
    }
  },
  mounted () {
    this.rulerControl = Control.ruler()
  },
  watch: {
    'displayOptions.ruler' (value) {
      if (value) {
        this.rulerControl.addTo(this.map)
        this.showSnackBar({ text: 'Press ESC or double click to finish and draw a new one', color: 'primary' })
      } else {
        this.map.removeControl(this.rulerControl)
      }
    },
  },
}
