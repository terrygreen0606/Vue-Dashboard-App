import axios from 'axios'
import * as L from 'leaflet'
import { getVesselIcon } from '../helpers'
import { zoneItemsDownload } from '@/mixins/menuItemsDownload/zoneItemsDownload'

export const vesselTrackLayer = {
  mixins: [
    zoneItemsDownload,
  ],

  data: () => ({
    vesselTrack: {
      display: false,
      id: null,
      tracks: null,
      layer: null,
      vesselType: '',
    },
  }),

  mounted () {
    this.vesselTrack.layer = L.layerGroup()
  },

  methods: {
    /**
     * get track data of vessel and render it
     * @param {number} id
     */
    getAndRenderVesselTrack (id) {
      // id = 5441
      this.vesselTrack.id = id
      axios.get(`ais/${id}/showdata`)
        .then(res => {
          this.vesselTrack.tracks = res.data.historical_track
          this.vesselType = res.data.vessel_type
          this.renderVesselTrackLayer()
        })
        .catch(err => {
          this.showSnackBar({
            text: `${err} on Track`,
            color: 'error',
          })
        })
    },

    /**
     * render vessel's track layer
     */
    renderVesselTrackLayer () {
      // add polyline
      const latlngs = this.vesselTrack.tracks.map(track => [track.lat, track.lon])
      const polyline = L.polyline(latlngs, { color: 'red' })
        .addTo(this.vesselTrack.layer)
      this.map.fitBounds(polyline.getBounds())

      // add duplicate polyline
      for (let i = 0; i < latlngs.length; i++) {
        latlngs[i][1] -= 360
      }
      L.polyline(latlngs, { color: 'red' }).addTo(this.vesselTrack.layer)

      // add markers with tooltip
      this.vesselTrack.tracks.forEach(track => {
        const {
          course,
          heading,
          lat,
          lon,
          mmsi,
          timestamp,
          zone_id: zoneId,
          status,
        } = track

        const icon = getVesselIcon(this.vesselType, status, 22)

        const content = `
          <b>Course: </b>${course}&deg;<br>
          <b>Heading: </b>${heading}&deg;<br>
          <b>Latitude: </b>${lat}<br>
          <b>Longitude: </b>${lon}<br>
          <b>MMSI: </b>${mmsi}<br>
          <b>Timestamp: </b>${timestamp}<br>
          <b>Zone: </b>${this.getZoneNameFromId(zoneId)}
        `
        L.marker(
          [lat, lon],
          {
            icon,
            rotationAngle: status ? 0 : heading,
          },
        )
          .addTo(this.vesselTrack.layer)
          .bindTooltip(content)

        // duplicate -360 markers
        L.marker(
          [lat, lon - 360],
          {
            icon,
            rotationAngle: status ? 0 : heading,
          },
        )
          .addTo(this.vesselTrack.layer)
          .bindTooltip(content)
      })

      // show layer
      this.map.addLayer(this.vesselTrack.layer)
      this.vesselTrack.display = true
    },

    closeTrackLayer () {
      this.vesselTrack.display = false
      if (this.map.hasLayer(this.vesselTrack.layer)) {
        this.map.removeLayer(this.vesselTrack.layer)
      }
      this.vesselTrack.layer.clearLayers()
    },

    getZoneNameFromId (zoneId) {
      const outside = 'Outside US EEZ'
      return zoneId
        ? (this.zoneItems.find(zone => zone.id === zoneId) || {}).name || outside
        : outside
    },
  },
}
