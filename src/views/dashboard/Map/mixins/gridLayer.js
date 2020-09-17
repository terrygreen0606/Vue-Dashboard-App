import { latlngGraticule } from 'leaflet'
import { toggleLayer } from '../helpers'

export const gridLayer = {
  data: function () {
    return {
      displayOptions: {
        grid: false,
      },
      latlngGrid: null,
    }
  },
  async mounted () {
    this.latlngGrid = latlngGraticule({
      interval: 20,
      showOriginLabel: true,
      redraw: 'move',
      zoomIntervals: [
        { start: 2, end: 3, interval: 20 },
        { start: 4, end: 4, interval: 10 },
        { start: 5, end: 7, interval: 5 },
        { start: 8, end: 10, interval: 1 },
      ],
    })
  },
  watch: {
    'displayOptions.grid' (value) {
      toggleLayer(this.map, this.latlngGrid, value)
    },
  },
}
