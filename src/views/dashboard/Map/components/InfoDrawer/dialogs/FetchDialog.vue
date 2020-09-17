<template>
  <v-dialog
    v-model="dialogModel"
    max-width="350px"
  >
    <v-card>
      <v-card-title>
        Fetch AIS Data
      </v-card-title>

      <v-divider />
      <v-card-text>
        <v-progress-linear
          v-if="!!loading"
          indeterminate
        />
        <v-list expand>
          <v-list-group
            v-for="(group, i) in groups"
            :key="i"
            :prepend-icon="group.icon"
            value="true"
          >
            <template v-slot:activator>
              <v-list-item-title>
                {{ group.name }}
              </v-list-item-title>
            </template>
            <v-list-item
              v-for="(item, j) in group.items"
              :key="j"
              class="ml-5"
              link
              @click="getDataFromApi(item.parameters)"
            >
              <v-list-item-icon>
                <v-icon
                  :color="item.color"
                >
                  {{ item.icon }}
                </v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                {{ item.name }}
              </v-list-item-title>
            </v-list-item>
          </v-list-group>
        </v-list>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          small
          class="display-1"
          @click="closeDialog"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import axios from 'axios'
  import { mapActions } from 'vuex'
  import { dialog } from '../../../mixins/dialog'
  export default {
    mixins: [dialog],
    props: {
      id: Number,
    },
    data () {
      return {
        terrestrial: false,
        satellite: false,
        terLoading: false,
        satLoading: false,
        loading: 0,
        fab: false,
      }
    },

    computed: {
      groups () {
        return [
          {
            name: 'Simple Response',
            icon: 'mdi-nfc-variant',
            items: [
              {
                name: 'Terrestrial Simple Response',
                icon: 'mdi-radio-tower',
                color: 'warning',
                parameters: [0, 0, 3], // extended, satellite, type
              },
              {
                name: 'Satellite Simple Response',
                icon: 'mdi-satellite-variant',
                color: 'error',
                parameters: [0, 1, 4],
              },
            ],
          },
          {
            name: 'Extended Response',
            icon: 'mdi-nfc-variant',
            items: [
              {
                name: 'Terrestrial Extended Response',
                icon: 'mdi-radio-tower',
                color: 'warning',
                parameters: [1, 0, 5],
              },
              {
                name: 'Satellite Extended Response',
                icon: 'mdi-satellite-variant',
                color: 'error',
                parameters: [1, 1, 6],
              },
            ],
          },
          {
            name: 'Historical Track',
            icon: 'mdi-map-marker-path',
            items: [
              {
                name: 'Terrestrial-AIS Track',
                icon: 'mdi-radio-tower',
                color: 'warning',
                parameters: [0, 0], // extended, satellite
              },
              {
                name: 'Satellite-AIS Track',
                icon: 'mdi-satellite-variant',
                color: 'error',
                parameters: [0, 1],
              },
            ],
          },
        ]
      },
    },

    methods: {
      ...mapActions({
        showSnackBar: 'showSnackBar',
      }),

      /**
       * parameters.length === 3 => [extended, satellite, type] meaning Response
       * parameters.length === 2 => [extended, satellite] meaning Track
       */
      getDataFromApi (parameters) {
        parameters.length === 3
          ? this.getAISData(...parameters)
          : this.getTrack(...parameters)
      },

      async getAISData (extended, satellite, type) {
        this.loading++
        try {
          const priceData = await axios.post(
            'ais/getcostaispoll',
            {
              vessel_ids: [this.id],
              type,
            },
          )
          if (priceData.data.success) {
            const res = await this.$confirm(
              `This bulk AIS action will cost approximately $${priceData.data.cost.toFixed(2)}. Would you like to proceed?`,
              { title: 'Warning' },
            )
            if (res) {
              const parametersPS07 = {
                id: this.id,
                satellite,
                extended,
              }
              const aisData = await axios.post(
                'ais/getaisposition',
                { parametersPS07 },
              )
              if (aisData.data.success && !aisData.data.emptyData) {
                this.showSnackBar({ text: aisData.data.message, color: 'success' })
                this.$emit('get:data-from-api', true)
              } else {
                this.showSnackBar({ text: aisData.data.message, color: 'warning' })
              }
            }
          } else {
            this.showSnackBar({ text: 'No Price data available', color: 'warning' })
          }
        } catch (err) {
          this.showSnackBar({ text: err, color: 'error' })
        }
        this.loading--
      },

      async getTrack (extended, satellite) {
        this.loading++
        try {
          const priceData = await axios.post(
            'ais/getcostaispoll',
            {
              vessel_ids: [this.id],
              type: satellite ? 8 : 7,
            },
          )
          if (priceData.data.success) {
            const res = await this.$confirm(
              `This bulk AIS action will cost approximately $${priceData.data.cost.toFixed(2)}. Would you like to proceed?`,
              { title: 'Warning' },
            )
            if (res) {
              const parametersPS07 = {
                id: this.id,
                satellite,
                extended,
              }
              const trackData = await axios.post(
                'ais/getaishistoricaltrack',
                { parametersPS07 },
              )
              if (trackData.data.success) {
                this.showSnackBar({ text: 'Historical Track Fetched', color: 'success' })
                this.$emit('get:data-from-api', true) // second parameter meaning to draw on map
              } else {
                this.showSnackBar({ text: trackData.data.message, color: 'warning' })
              }
            }
          } else {
            this.showSnackBar({ text: 'No Price data available', color: 'warning' })
          }
        } catch (err) {
          this.showSnackBar({ text: err, color: 'error' })
        }
        this.loading--
      },
    },
  }
</script>

<style lang="sass" scoped>
  .speed-dial-fab
    padding: 4.6px
    border-radius: 50%
  .single-dial
    transform: translateX(-90px)
    display: flex
    align-items: center
    justify-content: flex-end
  .fab-pos
    margin-bottom: 150px
</style>
