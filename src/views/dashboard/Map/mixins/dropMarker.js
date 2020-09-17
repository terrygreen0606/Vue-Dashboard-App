import axios from 'axios'

export const dropMarker = {
  data: function () {
    return {
      displayOptions: {
        drop: false,
      },
      drops: {
        edit: false, // edit mode?
        saved: true, // change saved?
        // states: ['CREATED', 'UPDATED', 'DELETED']
        data: [{ // real drops data
          id: 1,
          title: 'title',
          description: 'description',
          latitude: 20,
          longitude: 30,
          zone: 'OUTSIDE EEZ',
        }],
        editedData: null, // drops data to show on the map
        dropEditorData: null, // drop data to edit in the editor
        confirmReason: null, // ['Navigation', 'Close']: navigate to other router, close the drops layer
        confirmDialogModel: false, // confirm discard change dialog model
        zones: null, // zone test data
        dropEditorOptions: { left: 20, top: 80, pinned: true },
      },
      next: null, // router next
    }
  },

  computed: {
    confirmDialogTitle () {
      return this.drops.confirmReason === 'Navigation'
        ? 'Confirm Navigation'
        : 'Confirm Close Drops Layer'
    },

    confirmDialogCloseText () {
      return this.drops.confirmReason === 'Navigation'
        ? 'NO, STAY ON SECTION'
        : 'NO, DON\'T CLOSE'
    },
  },

  mounted () {
    this.$nextTick(() => {
      this.map.on('click', this.addDrop)
    })
  },

  beforeRouteLeave (to, from, next) {
    if (this.drops.saved) {
      next()
    } else {
      this.drops.confirmReason = 'Navigation'
      this.drops.confirmDialogModel = true
      this.next = next
    }
  },

  watch: {
    'displayOptions.drop' (value) {
      if (value) {
        this.initDropOptions()
        this.getDataFromApi().then(() => {
          this.copyDropsDataToEditedData()
        })
        // this.showSnackBar({ text: 'Check it off to disable the Drop', color: 'success' })
      } else {
        this.drops.dropEditorData = null
        this.drops.saved = true
        this.drops.edit = false
      }
    },

    'infoDrawerOptions.show' (value) {
      this.drops.dropEditorOptions.left = value ? 320 : 20
      const temp = this.drops.dropEditorData
      this.drops.dropEditorData = null
      setTimeout(() => {
        this.drops.dropEditorData = temp
      }, 5)
    },
  },

  methods: {
    getDataFromApi () {
      return new Promise((resolve, reject) => {
        if (!this.drops.zones) {
          this.loading++
          axios.get('map/zone-test-json')
            .then(res => {
              this.drops.zones = res.data.data
              this.loading--
            })
            .catch(err => {
              this.showSnackBar({ text: err, color: 'error' })
              this.loading--
              reject(err)
            })
        }
        resolve()
      })
    },

    initDropOptions () {
      this.drops = {
        ...this.drops,
        edit: false,
        saved: true,
        dropEditorData: null,
        confirmReason: null,
        confirmDialogModel: false,
      }
    },

    discardChanges () {
      this.drops.confirmDialogModel = false
      if (this.drops.confirmReason === 'Navigation') {
        this.next()
      } else { // confirmReason === 'Close'
        this.displayOptions.drop = false
      }
    },

    addDrop (e) {
      if (!this.drops.edit) return

      let longitude = e.latlng.lng < -180 ? e.latlng.lng + 360 : e.latlng.lng
      longitude = Number(longitude.toFixed(4))

      const drop = {
        id: this.drops.editedData.length ? this.drops.editedData[this.drops.editedData.length - 1].id + 1 : 1,
        title: '',
        description: '',
        latitude: Number(e.latlng.lat.toFixed(4)),
        longitude,
        state: 'CREATED',
      }
      drop.zone = this.getZoneName(drop).replace('_', ' ')

      this.drops.editedData.push(drop)
      this.drops.dropEditorData = drop
      this.drops.saved = false
    },

    handleDropClick (drop) {
      if (!this.drops.edit) return
      // set the data of drop editor to the clicked drop or null
      this.drops.dropEditorData = drop
    },

    handleEditDrops () {
      this.drops.edit = true
      this.drops.saved = true
      this.drops.dropEditorData = null
    },

    handleSaveDropsChanges () {
      // for only frontend
      this.drops.data = JSON.parse(JSON.stringify(this.drops.editedData.filter(drop => drop.state !== 'DELETED')))
      this.drops.data.forEach(drop => {
        delete drop.state
      })
      this.drops.dropEditorData = null
      this.drops.edit = false
      this.drops.saved = true
      this.copyDropsDataToEditedData()
    },

    handleDiscardDropsChanges () {
      this.copyDropsDataToEditedData()
      this.drops.dropEditorData = null
      this.drops.saved = true
      this.drops.edit = false
    },

    copyDropsDataToEditedData () {
      this.drops.editedData = JSON.parse(JSON.stringify(this.drops.data))
    },

    handleDropLatLngUpdate (latlng, drop) {
      // NOTE: to prevent the editor showing up when close the edit mode
      if (!this.drops.edit) return

      const longitude = latlng.lng < -180 ? latlng.lng + 360 : latlng.lng

      drop.latitude = Number(latlng.lat.toFixed(4))
      drop.longitude = Number(longitude.toFixed(4))
      drop.zone = this.getZoneName(drop).replace('_', ' ')

      this.drops.dropEditorData = drop
      this.handleDropDataUpdate(drop)
    },

    handleDropDataUpdate (drop) {
      this.drops.saved = false
      if (drop.state !== 'CREATED') {
        drop.state = 'UPDATED'
      }
    },

    handleCloseDrops () {
      if (this.drops.saved) {
        this.displayOptions.drop = false
      }
      if (!this.drops.saved) {
        this.drops.confirmReason = 'Close'
        this.drops.confirmDialogModel = true
      }
    },

    handleDeleteDrop () {
      // if it's created drop, remove it from the editedData list
      // else, just state it 'DELETED', so that backend removes the drop from database
      if (this.drops.dropEditorData.state === 'CREATED') {
        const i = this.drops.editedData.findIndex(drop => drop.id === this.drops.dropEditorData.id)
        if (i >= 0) {
          this.drops.editedData.splice(i, 1)
        }
      } else {
        this.drops.dropEditorData.state = 'DELETED'
      }
      this.drops.dropEditorData = null
    },

    closeDropEditor () {
      this.infoDrawerOptions.temporary = false
      this.drops.dropEditorData = null
      setTimeout(() => {
        this.infoDrawerOptions.temporary = true
      }, 5)
    },

    getZoneName ({ latitude: pointY, longitude: pointX }) {
      const outsideEEZ = 'OUTSIDE_EEZ'
      if (pointX <= -65.7 && pointX >= -129.25 && pointY <= 49 && pointY >= 23.8) {
        // CONUS
        if (pointX <= -104.05 && pointX >= -129.25 && pointY <= 49 && pointY >= 30.5) {
          // WEST COAST
          const zoneNames = [
            'Upper_Mississippi_River',
            'Corpus_Christi',
            'Puget_Sound',
            'Columbia_River',
            'San_Francisco',
            'Los_Angeles_Long_Beach',
            'San_Diego',
          ]
          for (let i = 0; i < zoneNames.length; i++) {
            if (this.getPolyTest(zoneNames[i], pointY, pointX)) return zoneNames[i]
          }
          return outsideEEZ
        } else if (pointX <= -71.25 && pointX >= -104.05 && pointY <= 37 && pointY >= 23.8) {
          // SOUTH
          const zoneNames = [
            'Upper_Mississippi_River',
            'Corpus_Christi',
            'Houston_Galveston',
            'Port_Arthur',
            'Morgan_City',
            'New_Orleans',
            'Mobile',
            'St_Petersburg',
            'Key_West',
            'Miami',
            'Jacksonville',
            'MSU_Savannah',
            'Charleston',
            'North_Carolina',
            'Hampton_Roads',
            'Ohio_Valley',
            'Lower_Mississippi',
          ]
          for (let i = 0; i < zoneNames.length; i++) {
            if (this.getPolyTest(zoneNames[i], pointY, pointX)) return zoneNames[i]
          }
          return outsideEEZ
        } else if (pointX <= -65.65 && pointX >= -104.05 && pointY <= 49.39 && pointY >= 37) {
          // NORTH AND LAKE
          const zoneNames = [
            'Upper_Mississippi_River',
            'Ohio_Valley',
            'Hampton_Roads',
            'Baltimore',
            'MSU_Pittsburgh',
            'Delaware_Bay',
            'New_York',
            'Long_Island_Sound',
            'Southeastern_New_England',
            'Northern_New_England',
            'Boston',
            'Buffalo',
            'Detroit',
            'Lake_Michigan',
            'Sault_Ste_Marie',
            'Duluth',
          ]
          for (let i = 0; i < zoneNames.length; i++) {
            if (this.getPolyTest(zoneNames[i], pointY, pointX)) return zoneNames[i]
          }
          return outsideEEZ
        }
        return outsideEEZ
      } else if (pointX <= -63.85 && pointX >= -68.55 && pointY <= 21.9 && pointY >= 14.9) {
        // SAN JUAN
        const zoneNames = [
          'San_Juan',
        ]
        for (let i = 0; i < zoneNames.length; i++) {
          if (this.getPolyTest(zoneNames[i], pointY, pointX)) return zoneNames[i]
        }
        return outsideEEZ
      } else if (pointX >= -180 && pointX <= -130 && pointY <= 75 && pointY >= 47.8) {
        // Alaska
        const zoneNames = [
          'Southeast_Alaska',
          'Prince_William_Sound',
          'Western_Alaska',
        ]
        for (let i = 0; i < zoneNames.length; i++) {
          if (this.getPolyTest(zoneNames[i], pointY, pointX)) return zoneNames[i]
        }
        return outsideEEZ
      } else if (pointX <= 180 && pointX >= 167.5 && pointY <= 60.1 && pointY >= 47.8) {
        // Western Alaska
        const zoneNames = [
          'Western_Alaska',
        ]
        for (let i = 0; i < zoneNames.length; i++) {
          if (this.getPolyTest(zoneNames[i], pointY, pointX)) return zoneNames[i]
        }
        return outsideEEZ
      } else if (
        // Honolulu
        (pointX <= -151.25 && pointX >= -180 && pointY <= 31.9 && pointY >= 0) ||
        (pointX <= -157.4 && pointX >= -180 && pointY <= 0 && pointY >= -3.75) ||
        (pointX <= 170.25 && pointX >= 163.25 && pointY <= 22.7 && pointY >= 16.25) ||
        (pointX <= 180 && pointX >= 177.8 && pointY <= 31.5 && pointY >= 25.35)
      ) {
        const zoneNames = [
          'Honolulu',
        ]
        for (let i = 0; i < zoneNames.length; i++) {
          if (this.getPolyTest(zoneNames[i], pointY, pointX)) return zoneNames[i]
        }
        return outsideEEZ
      } else if (pointX <= 149.75 && pointX >= 141.15 && pointY <= 23.95 && pointY >= 10.9) {
        const zoneNames = [
          'Guam',
        ]
        for (let i = 0; i < zoneNames.length; i++) {
          if (this.getPolyTest(zoneNames[i], pointY, pointX)) return zoneNames[i]
        }
        return outsideEEZ
      }
      return outsideEEZ
    },

    getPolyTest (zoneName, pointY, pointX) {
      // if 0 -> error on polyTest, so give it epsilon
      const eps = 1e-4
      if (Math.abs(pointY) < eps) pointY = eps
      if (Math.abs(pointX) < eps) pointX = eps

      const zone = this.drops.zones.find(zone => zone.name === zoneName)
      let insideZone = false
      let i = 0
      const l = zone.points.length
      let j = l - 1
      for (; i < l; j = i++) {
        if (
          (zone.points[i].y > pointY) !== (zone.points[j].y > pointY) &&
          pointX <=
            ((zone.points[j].x - zone.points[i].x) * (pointY - zone.points[i].y)) / (zone.points[j].y - zone.points[i].y) +
              zone.points[i].x
        ) {
          insideZone = !insideZone
        }
      }
      return insideZone
    },
  },
}
