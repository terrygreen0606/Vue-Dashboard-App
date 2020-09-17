<template>
  <div>
    <base-material-card
      color="primary"
      title="Individual Address"
    >
      <v-progress-linear
        v-if="!!loading"
        indeterminate
      />
      <v-card-text>
        <l-map
          v-if="address.latitude && address.longitude"
          id="map"
          :zoom="13"
          :center="[address.latitude, address.longitude]"
          :options="{ dragging: false, scrollWheelZoom: false}"
        >
          <l-tile-layer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png" />
          <l-marker :lat-lng="[address.latitude, address.longitude]" />
        </l-map>
        <v-row>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="address.street"
              label="Street"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="address.unit"
              label="Unit"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="address.city"
              label="City"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="address.state"
              label="State"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="address.province"
              label="Province"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="address.zip"
              label="Zip"
              type="text"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-autocomplete
              v-model="address.country"
              :items="countryItems"
              item-text="name"
              item-value="id"
              label="Country"
            >
              <template
                v-if="address.country"
                v-slot:prepend
              >
                <flag
                  :iso="address.country"
                  :squared="false"
                />
              </template>
              <template
                v-else
                v-slot:prepend
              >
                <v-icon>mdi-flag</v-icon>
              </template>
            </v-autocomplete>
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="address.phone"
              label="Phone"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="address.zone_name"
              label="Zone"
            />
          </v-col>
          <v-col
            cols="12"
            sm="3"
          >
            <v-text-field
              v-model="address.latitude"
              label="Latitude"
            />
          </v-col>
          <v-col
            cols="12"
            sm="3"
          >
            <v-text-field
              v-model="address.longitude"
              label="Longitude"
            />
          </v-col>
        </v-row>
        <v-btn
          color="primary"
          @click="saveAddress"
        >
          Save
        </v-btn>
        <v-btn
          color="error"
          @click="deleteAddress"
        >
          Delete Address
        </v-btn>
      </v-card-text>
    </base-material-card>
  </div>
</template>

<script>
  import axios from 'axios'
  import { mapActions, mapState } from 'vuex'
  import { LMap, LTileLayer, LMarker } from 'vue2-leaflet'
  import { countryItemsDownload } from '@/mixins/menuItemsDownload/countryItemsDownload'
  import { checkCUD } from '@/shared/management'

  export default {
    components: {
      LMap, LTileLayer, LMarker,
    },
    mixins: [
      countryItemsDownload,
    ],
    data: () => ({
      loading: 0,
      address: {},
      zone: null,
    }),
    computed: {
      ...mapState({
        role: state => state.authentication.role,
      }),
    },
    mounted () {
      this.getAddress()
    },
    methods: {
      ...mapActions({
        showSnackBar: 'showSnackBar',
      }),
      getAddress () {
        this.loading++
        axios.get(`users/${this.$route.params.id}/addresses`)
          .then(res => {
            this.address = res.data
            this.loading--
          })
      },
      saveAddress () {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        axios.post(`users/addresses/${this.$route.params.id}`, { address: this.address })
          .then(res => {
            this.getAddress()
            this.showSnackBar({ text: res.data.message, color: 'success' })
          }).catch(error => {
            this.showSnackBar({ text: error.response.data.message || error.response.statusText, color: 'error' })
          })
      },
      deleteAddress () {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        this.$confirm(`Please confirm that you would like to delete the following address:
          <b>${this.address.street} ${this.address.city} ${this.address.country}</b>`)
          .then(res => {
            if (res) {
              axios.delete('users/addresses/' + this.address.id)
                .then(res => {
                  this.getAddress()
                  this.showSnackBar({ text: res.data.message, color: 'success' })
                }).catch(error => {
                  this.showSnackBar({ text: error.response.data.message || error.response.statusText, color: 'error' })
                })
            }
          })
      },
    },
  }
</script>
