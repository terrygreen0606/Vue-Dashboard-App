<template>
  <div>
    <base-material-card
      color="primary"
      title="Address"
    >
      <v-progress-linear
        v-if="!!loading"
        indeterminate
      />
      <v-card-text v-else>
        <base-material-tabs
          v-model="activeTab"
          color="info"
          :fixed-tabs="$vuetify.breakpoint.smAndUp"
          show-arrows
          height="36"
        >
          <v-tab
            v-for="addressesItem in addressesItems"
            :key="addressesItem.id"
          >
            <span>
              {{ addressesItem.name }}
            </span>
          </v-tab>
          <v-tabs-items
            v-model="activeTab"
          >
            <v-tab-item
              v-for="addressesItem in addressesItems"
              :key="addressesItem.id"
            >
              <div
                v-if="addressesItem.addresses.length > 0"
              >
                <div
                  v-for="address in addressesItem.addresses"
                  :key="address.id"
                >
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
                      cols="6"
                      sm="3"
                    >
                      <v-text-field
                        v-model="address.latitude"
                        label="Latitude"
                      />
                    </v-col>
                    <v-col
                      cols="6"
                      sm="3"
                    >
                      <v-text-field
                        v-model="address.longitude"
                        label="Longitude"
                      />
                    </v-col>
                  </v-row>
                  <v-row class="footer">
                    <v-btn
                      color="success"
                      small
                      @click="saveAddress(address)"
                    >
                      <v-icon left>
                        mdi-content-save
                      </v-icon>
                      Save
                    </v-btn>
                    <v-btn
                      color="error"
                      small
                      @click="deleteAddress(address)"
                    >
                      <v-icon left>
                        mdi-delete
                      </v-icon>
                      Delete Address
                    </v-btn>
                    <v-spacer />
                    <v-btn
                      color="info"
                      small
                      @click="showDocumentFormat(address)"
                    >
                      <v-icon left>
                        mdi-text-box
                      </v-icon>
                      Document Format
                    </v-btn>
                    <v-btn
                      color="primary"
                      small
                      @click="addAddress(addressesItem.id)"
                    >
                      <v-icon left>
                        mdi-map-marker-plus
                      </v-icon>
                      Add Address
                    </v-btn>
                  </v-row>
                </div>
              </div>
              <template v-else>
                <base-material-alert
                  color="warning"
                  dark
                >
                  No Addresses Defined
                </base-material-alert>
                <v-btn
                  color="primary"
                  small
                  @click="addAddress(addressesItem.id)"
                >
                  <v-icon left>
                    mdi-map-marker-plus
                  </v-icon>
                  Add Address
                </v-btn>
              </template>
            </v-tab-item>
          </v-tabs-items>
        </base-material-tabs>
      </v-card-text>
    </base-material-card>
    <v-dialog
      v-model="showFormatForm"
      max-width="500"
    >
      <v-card>
        <v-card-title>Document Address</v-card-title>
        <v-divider />
        <v-card-text>
          <v-textarea v-model="documentFormatAddress.document_format" />
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            text
            @click="showFormatForm = false"
          >
            Close
          </v-btn>
          <v-btn
            color="success"
            text
            @click="saveAddressFormat"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import { LMap, LTileLayer, LMarker } from 'vue2-leaflet'
  import { mapActions, mapState } from 'vuex'
  import { makeDocumentFormat } from '../utils'
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
      activeTab: 0,
      addressesItems: [],
      showFormatForm: false,
      documentFormatAddress: {
        document_format: '',
      },
      loading: 0,
    }),
    computed: {
      ...mapState({
        role: state => state.authentication.role,
      }),
    },
    mounted () {
      this.getAddresses()
    },
    methods: {
      ...mapActions({
        showSnackBar: 'showSnackBar',
      }),
      getAddresses () {
        this.loading++
        axios.get('companies/' + this.$route.params.id + '/addresses')
          .then(res => {
            this.addressesItems[0] = res.data.find(a => a.name === 'Primary')
            this.addressesItems[0].icon = 'mdi-home-map-marker'
            this.addressesItems[1] = res.data.find(a => a.name === 'Billing')
            this.addressesItems[1].icon = 'mdi-file-document'
            this.addressesItems[2] = res.data.find(a => a.name === 'Branches')
            this.addressesItems[2].icon = 'mdi-source-branch'
            this.loading--
          })
      },
      saveAddress (address) {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        axios.post('companies/addresses/' + address.id, { ...address })
          .then(res => {
            this.showSnackBar({ text: res.data.message, color: 'success' })
            this.getAddresses()
          })
          .catch(error => {
            this.showSnackBar({ text: error, color: 'error' })
          })
      },
      deleteAddress (address) {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        this.$confirm(`Please confirm that you would like to delete the following address:
          <b>${address.street} ${address.city} ${address.country}</b>`, { title: 'Warning' })
          .then(res => {
            if (res) {
              axios.delete('companies/addresses/' + address.id)
                .then(res => {
                  this.showSnackBar({ text: res.data.message, color: 'success' })
                  this.getAddresses()
                })
                .catch(error => {
                  this.showSnackBar({ text: error, color: 'error' })
                })
            }
          })
      },
      showDocumentFormat (address) {
        const updatedFormatAddress = address.document_format
          ? address.document_format.replace(/\u21b5/g, '\n')
          : makeDocumentFormat(address)
        this.documentFormatAddress = Object.assign({}, address, { document_format: updatedFormatAddress })

        this.showFormatForm = true
      },
      saveAddressFormat () {
        this.saveAddress(this.documentFormatAddress)
        this.showFormatForm = false
      },
      addAddress (typeId) {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        axios.post('companies/' + this.$route.params.id + '/addresses/store', { type_id: typeId })
          .then(res => {
            this.getAddresses()
            this.showSnackBar({ text: res.data.message, color: 'success' })
          }).catch(error => {
            this.showSnackBar({ text: error.response.data.message || error.response.statusText, color: 'error' })
          })
      },
    },
  }
</script>

<style lang="sass">
  .footer>.v-btn
    margin: 12px !important
</style>
