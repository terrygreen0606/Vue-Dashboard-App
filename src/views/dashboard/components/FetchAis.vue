<template>
  <base-material-card
    color="primary"
    icon="mdi-access-point"
    width="100%"
  >
    <v-progress-linear
      v-if="fetchingAisData"
      indeterminate
    />
    <template v-slot:after-heading>
      <div class="display-1 mt-2">
        Fetch AIS Data
      </div>
    </template>
    <div class="mt-5">
      <v-btn
        class="px-1 ml-1"
        color="primary"
        min-width="0"
        fab
        x-small
        @click="getAISData(0, 0, 3)"
      >
        <v-icon
          small
        >
          mdi-radio-tower
        </v-icon>
      </v-btn>
      Terrestrial Simple Response
    </div>
    <div class="mt-3">
      <v-btn
        class="px-1 ml-1"
        color="error"
        min-width="0"
        fab
        x-small
        @click="getAISData(0, 1, 4)"
      >
        <v-icon
          small
        >
          mdi-satellite-variant
        </v-icon>
      </v-btn>
      Satellite Simple Response
    </div>
    <div class="mt-3">
      <v-btn
        class="px-1 ml-1"
        color="primary"
        min-width="0"
        fab
        x-small
        @click="getAISData(1, 0, 5)"
      >
        <v-icon
          small
        >
          mdi-radio-tower
        </v-icon>
      </v-btn>
      Terrestrial Extended Response
    </div>
    <div class="mt-3">
      <v-btn
        class="px-1 ml-1"
        color="error"
        min-width="0"
        fab
        x-small
        @click="getAISData(1, 1, 6)"
      >
        <v-icon
          small
        >
          mdi-satellite-variant
        </v-icon>
      </v-btn>
      Satellite Extended Response
    </div>
    <div class="mt-3">
      <v-btn
        class="px-1 ml-1"
        color="primary"
        min-width="0"
        fab
        x-small
        @click="getParticular(1)"
      >
        <v-icon
          small
        >
          mdi-pencil-ruler
        </v-icon>
      </v-btn>
      Particulars
    </div>
    <div class="mt-3 d-flex">
      <v-speed-dial
        direction="right"
        transition="slide-y-reverse-transition"
      >
        <template v-slot:activator>
          <v-btn
            class="px-1 ml-1"
            color="success"
            min-width="0"
            fab
            x-small
          >
            <v-icon
              small
            >
              mdi-map-marker-path
            </v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title
            class="success white--text pa-3 justify-center"
          >
            Historical Track
          </v-card-title>
          <v-btn
            v-for="(track, i) in tracks"
            :key="i"
            text
            @click="sendTrack(track)"
          >
            <v-icon
              left
            >
              {{ track.icon }}
            </v-icon>
            {{ track.name }}
          </v-btn>
        </v-card>
      </v-speed-dial>
      <span class="mt-1 ml-1">Historical Track</span>
    </div>
    <v-tooltip
      v-if="disabled"
      top
    >
      <template v-slot:activator="{ on }">
        <div v-on="on">
          <v-switch
            v-model="terrestrial"
            label="Terrestrial Location Continuous"
            :loading="terLoading"
            :disabled="disabled"
            @change="locate(3, 0)"
          />
        </div>
      </template>
      <span>On/In Network or Fleet</span>
    </v-tooltip>
    <v-switch
      v-else
      v-model="terrestrial"
      label="Terrestrial Location Continuous"
      :loading="terLoading"
      @change="locate(3, 0)"
    />
    <v-tooltip
      v-if="disabled"
      top
    >
      <template v-slot:activator="{ on }">
        <div v-on="on">
          <v-switch
            v-model="satellite"
            label="Satellite Location Continuous"
            class="mt-0"
            :loading="satLoading"
            :disabled="disabled"
            @change="locate(4, 1)"
          />
        </div>
      </template>
      <span>On/In Network or Fleet</span>
    </v-tooltip>
    <v-switch
      v-else
      v-model="satellite"
      label="Satellite Location Continuous"
      class="mt-0"
      :loading="satLoading"
      @change="locate(4, 1)"
    />
  </base-material-card>
</template>

<script>
  import axios from 'axios'
  import { mapActions, mapState } from 'vuex'
  import { checkCUD } from '@/shared/management'

  export default {
    props: {
      aisrequest: {
        type: Object,
        default: () => ({
          extended: undefined,
          satellite: undefined,
          pollType: 0,
          flag: '',
        }),
      },
    },
    data: () => ({
      extendedAis: null,
      tracks: [
        { name: 'Simple terrestrial-AIS Track', icon: 'mdi-radio-tower', extended: 0, satellite: 0 },
        { name: 'Simple satellite-AIS Track', icon: 'mdi-satellite-variant', extended: 0, satellite: 1 },
      ],
      terrestrial: false,
      satellite: false,
      terLoading: false,
      satLoading: false,
      terInterval: 0,
      satInterval: 0,
      fetchingAisData: false,
      interval: 0,
      disabled: false,
    }),
    computed: {
      ...mapState({
        role: state => state.authentication.role,
      }),
    },
    watch: {
      terrestrial (newValue) {
        if (newValue) {
          this.terLoading = 'primary'
          this.satellite = false
        } else {
          this.terLoading = false
        }
      },
      satellite (newValue) {
        if (newValue) {
          this.satLoading = 'primary'
          this.terrestrial = false
        } else {
          this.satLoading = false
        }
      },
      aisrequest (val) {
        if (Object.keys(val).length) {
          if (val.flag === 'position') {
            this.getAISData(val.extended, val.satellite, val.pollType)
          } else if (val.flag === 'particular') {
            this.getParticular(val.pollType)
          } else if (val.flag === 'track') {
            const track = { extended: val.extended, satellite: val.satellite }
            this.sendTrack(track)
          }
        }
      },
    },
    mounted () {
      this.getDataFromApi()
      this.getGlobalIntervals()
    },
    methods: {
      ...mapActions({
        showSnackBar: 'showSnackBar',
      }),
      getDataFromApi () {
        this.fetchingAisData = true
        axios.get('ais/' + this.$route.params.id + '/showdata')
          .then(res => {
            if (res.data.isNetwork || res.data.isFleet) {
              this.disabled = true
            }
            if (res.data.contActive.active) {
              if (res.data.contActive.satellite) {
                this.satellite = true
              } else {
                this.terrestrial = true
              }
            } else {
              this.satellite = false
              this.terrestrial = false
            }
            this.extendedAis = res.data
            this.$emit('getExtendedAis', this.extendedAis)
          })
          .catch(err => {
            this.showSnackBar({
              text: `${err} on AIS download`,
              color: 'error',
            })
          })
          .finally(() => {
            this.fetchingAisData = false
          })
      },
      getGlobalIntervals () {
        axios.get('ais/getaissettings').then(res => {
          this.terInterval = res.data.terrestrial_positions_interval_single
          this.satInterval = res.data.satellite_positions_interval_single
        })
      },
      async getAISData (extended, satellite, pollType) {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        this.fetchingAisData = true
        const priceData = await axios.post('ais/getcostaispoll', { vessel_ids: [this.$route.params.id], type: pollType })
        if (priceData.data.success) {
          const res = await this.$confirm(`This bulk AIS action will cost approximately $${priceData.data.cost.toFixed(2)}. Would you like to proceed?`, { title: 'Warning' })
          if (res) {
            const parametersPS07 = {
              id: this.$route.params.id, satellite, extended,
            }
            const aisData = await axios.post('ais/getaisposition', { parametersPS07 })
            if (aisData.data.success) {
              this.showSnackBar({ text: aisData.data.message, color: 'success' })
              this.getDataFromApi()
              this.$emit('get:data-from-api')
            } else {
              this.showSnackBar({ text: aisData.data.message, color: 'warning' })
              this.fetchingAisData = false
            }
          } else {
            this.fetchingAisData = false
          }
        } else {
          this.showSnackBar({ text: 'No Price data available', color: 'warning' })
        }
      },
      async sendTrack (track) {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        this.fetchingAisData = true
        const priceData = await axios.post('ais/getcostaispoll', { vessel_ids: [this.$route.params.id], type: track.satellite ? 8 : 7 })
        if (priceData.data.success) {
          const res = await this.$confirm(`This bulk AIS action will cost approximately $${priceData.data.cost.toFixed(2)}. Would you like to proceed?`, { title: 'Warning' })
          if (res) {
            const parametersPS07 = {
              id: this.$route.params.id, satellite: track.satellite, extended: track.extended,
            }
            const trackData = await axios.post('ais/getaishistoricaltrack', { parametersPS07 })
            trackData.data.success
              ? this.showSnackBar({ text: 'Historical Track Fetched', color: 'success' })
              : this.showSnackBar({ text: trackData.data.message, color: 'warning' })
            this.$emit('get:data-from-api')
            this.getDataFromApi()
          }
        } else {
          this.showSnackBar({ text: 'No Price data available', color: 'warning' })
        }
        this.discardChanges()
      },
      async locate (pollType, satellite) {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        this.fetchingAisData = true
        let condition = 1
        if (!this.terrestrial && !this.satellite) {
          condition = 0
        }
        if (condition) {
          satellite ? this.interval = this.satInterval : this.interval = this.terInterval
          const priceData = await axios.post('ais/getcostaispoll', { vessel_ids: [this.$route.params.id], type: pollType })
          if (priceData.data.success) {
            const res = await this.$confirm(`This bulk AIS action will cost approximately $${priceData.data.cost.toFixed(2)} every ${this.interval} minutes. Would you like to proceed?`, { title: 'Warning' })
            if (res) {
              const aisData = await axios.post(`ais/getaispositioncont/${this.$route.params.id}/${satellite}/${condition}`)
              aisData.data.success
                ? this.showSnackBar({ text: aisData.data.message, color: 'success' })
                : this.showSnackBar({ text: aisData.data.message, color: 'warning' })
            }
          } else {
            this.showSnackBar({ text: 'No Price data available', color: 'warning' })
          }
        } else {
          const aisData = await axios.post(`ais/getaispositioncont/${this.$route.params.id}/${satellite}/${condition}`)
          aisData.data.success
            ? this.showSnackBar({ text: aisData.data.message, color: 'success' })
            : this.showSnackBar({ text: aisData.data.message, color: 'warning' })
        }
        this.discardChanges()
      },
      async getParticular (pollType) {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        this.fetchingAisData = true
        const priceData = await axios.post('ais/getcostaispoll', { vessel_ids: [this.$route.params.id], type: pollType })
        if (priceData.data.success) {
          const res = await this.$confirm(`This bulk AIS action will cost approximately $${priceData.data.cost.toFixed(2)}. Would you like to proceed?`, { title: 'Warning' })
          if (res) {
            const aisData = await axios.post('ais/getparticular/' + this.$route.params.id)
            aisData.data.success
              ? this.showSnackBar({ text: aisData.data.message, color: 'success' })
              : this.showSnackBar({ text: aisData.data.message, color: 'warning' })
          }
        } else {
          this.showSnackBar({ text: 'No Price data available', color: 'warning' })
        }
        this.discardChanges()
      },
      discardChanges () {
        this.interval = 0
        this.getDataFromApi()
      },
    },
  }
</script>
