<template>
  <div>
    <base-material-card
      color="primary"
      title="General Information"
    >
      <v-progress-linear
        v-if="!!loading"
        indeterminate
      />
      <v-card-text>
        <base-material-tabs
          v-model="activeTab"
          color="info"
          :fixed-tabs="$vuetify.breakpoint.smAndUp"
          show-arrows
          height="36"
        >
          <v-tab v-if="role && checkVesselGeneralTabs('vessel_data', role.id)">
            Vessel Data
          </v-tab>
          <v-tab v-if="role && checkVesselGeneralTabs('plan_data', role.id)">
            Plan Data
          </v-tab>
          <v-tab v-if="role && checkVesselGeneralTabs('vrp', role.id)">
            VRP
          </v-tab>
          <v-tab v-if="role && checkVesselGeneralTabs('communications', role.id)">
            Communications
          </v-tab>
          <v-tabs-items
            v-model="activeTab"
            class="tabs-container"
          >
            <v-tab-item v-if="role && checkVesselGeneralTabs('vessel_data', role.id)">
              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    v-model="editedItem.name"
                    :rules="[v => !!v || 'Vessel Name is required']"
                    prepend-icon="mdi-ferry"
                    label="Vessel Name *"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-autocomplete
                    v-model="editedItem.vessel_type_id"
                    :items="vesselTypeItems"
                    item-text="name"
                    item-value="id"
                    prepend-icon="mdi-tag"
                    label="Vessel Type"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    v-model="editedItem.imo"
                    type="number"
                    prepend-icon="mdi-fingerprint"
                    label="IMO Number"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    v-model="editedItem.official_number"
                    prepend-icon="mdi-format-list-numbered"
                    label="Official Number"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    v-model="editedItem.dead_weight"
                    prepend-icon="mdi-weight"
                    label="Deadweight"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    v-model="editedItem.mmsi"
                    type="number"
                    prepend-icon="mdi-antenna"
                    label="MMSI Number"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    v-model="editedItem.deck_area"
                    prepend-icon="mdi-texture-box"
                    label="Deck Area (sq meters)"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    v-model="editedItem.oil_tank_volume"
                    prepend-icon="mdi-hydraulic-oil-level"
                    label="Oil Tank Volume (cubic meters)"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="4"
                >
                  <v-select
                    v-model="editedItem.oil_group"
                    :items="['I', 'II', 'III', 'IV', 'V']"
                    prepend-icon="mdi-oil"
                    label="Oil Group"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="4"
                >
                  <v-autocomplete
                    v-model="editedItem.fleet_id"
                    :items="fleetItems"
                    item-text="name"
                    item-value="id"
                    label="Fleets"
                    prepend-icon="mdi-anchor"
                    multiple
                    clearable
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="4"
                >
                  <v-switch
                    v-model="editedItem.tanker"
                    color="info"
                    label="Is Tank Vessel"
                  />
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item v-if="role && checkVesselGeneralTabs('plan_data', role.id)">
              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-autocomplete
                    v-model="editedItem.qi"
                    :items="qiItems"
                    item-text="name"
                    item-value="id"
                    multiple
                    clearable
                    prepend-icon="mdi-clipboard-account"
                    label="QI Company"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-autocomplete
                    v-model="editedItem.company_id"
                    :items="companyItems"
                    item-text="name"
                    item-value="id"
                    clearable
                    :rules="[v => !!v || 'Company is required']"
                    prepend-icon="mdi-domain"
                    label="Company * (Plan Holder)"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-autocomplete
                    v-model="editedItem.operating_company_id"
                    :items="companyItems"
                    item-text="name"
                    item-value="id"
                    multiple
                    clearable
                    prepend-icon="mdi-domain"
                    label="Operating Company"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-autocomplete
                    v-model="editedItem.societies"
                    :items="societyItems"
                    item-text="fullname"
                    item-value="id"
                    multiple
                    clearable
                    prepend-icon="mdi-axis-arrow-lock"
                    label="Classification Society"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-autocomplete
                    v-model="editedItem.insurers"
                    :items="insurerItems"
                    item-text="name"
                    item-value="id"
                    multiple
                    clearable
                    prepend-icon="mdi-engine"
                    label="H & M Insurer"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-autocomplete
                    v-model="editedItem.providers"
                    :items="providerItems"
                    item-text="name"
                    item-value="id"
                    multiple
                    clearable
                    prepend-icon="mdi-chart-bell-curve"
                    label="Damage Stability Provider"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-autocomplete
                    v-model="editedItem.pi"
                    :items="piItems"
                    item-text="name"
                    item-value="id"
                    multiple
                    clearable
                    prepend-icon="mdi-umbrella"
                    label="P & I Club"
                  />
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item v-if="role && checkVesselGeneralTabs('vrp', role.id)">
              <v-row>
                <v-col
                  v-for="(item, i) in vrpListItems"
                  :key="i"
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    v-model="item.model"
                    :prepend-icon="item.icon"
                    :label="item.label"
                    readonly
                  />
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item v-if="role && checkVesselGeneralTabs('communications', role.id)">
              <v-row class="vessel-info-heading">
                Vessel "Company" Contacts (aka DPA)
              </v-row>
              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-autocomplete
                    v-model="editedItem.primary_poc_id"
                    :items="vesselContactItems"
                    item-text="name"
                    item-value="id"
                    clearable
                    prepend-icon="mdi-office-building"
                    label="Primary"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-autocomplete
                    v-model="editedItem.secondary_poc_id"
                    :items="vesselContactItems"
                    item-text="name"
                    item-value="id"
                    clearable
                    prepend-icon="mdi-office-building"
                    label="Secondary"
                  />
                </v-col>
              </v-row>
              <v-row class="vessel-info-heading">
                Vessel Contact Information
              </v-row>
              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    v-model="editedItem.sat_phone_primary"
                    prepend-icon="mdi-phone"
                    label="SAT Telephone Primary"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    v-model="editedItem.sat_phone_secondary"
                    prepend-icon="mdi-phone"
                    label="SAT Telephone Secondary"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    v-model="editedItem.email_primary"
                    prepend-icon="mdi-email"
                    label="Email Primary"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    v-model="editedItem.email_secondary"
                    prepend-icon="mdi-email"
                    label="Email Secondary"
                  />
                </v-col>
              </v-row>
            </v-tab-item>
          </v-tabs-items>
        </base-material-tabs>
        <v-btn
          v-if="activeTab !== 2"
          color="primary"
          @click="saveVessel"
        >
          Save
        </v-btn>
        <v-btn
          v-if="activeTab !== 2"
          color="error"
          @click="deleteVessel"
        >
          Delete Vessel
        </v-btn>
      </v-card-text>
    </base-material-card>
  </div>
</template>

<script>
  import axios from 'axios'
  import { mapActions, mapState } from 'vuex'
  import { vesselTypeItemsDownload } from '@/mixins/menuItemsDownload/vesselTypeItemsDownload'
  import { fleetItemsDownload } from '@/mixins/menuItemsDownload/fleetItemsDownload'
  import { piItemsDownload } from '@/mixins/menuItemsDownload/piItemsDownload'
  import { qiItemsDownload } from '@/mixins/menuItemsDownload/qiItemsDownload'
  import { societyItemsDownload } from '@/mixins/menuItemsDownload/societyItemsDownload'
  import { providerItemsDownload } from '@/mixins/menuItemsDownload/providerItemsDownload'
  import { insurerItemsDownload } from '@/mixins/menuItemsDownload/insurerItemsDownload'
  import { companyItemsDownload } from '@/mixins/menuItemsDownload/companyItemsDownload'
  import { checkVesselGeneralTabs, checkCUD } from '@/shared/management'

  export default {
    mixins: [
      vesselTypeItemsDownload,
      fleetItemsDownload,
      piItemsDownload,
      qiItemsDownload,
      societyItemsDownload,
      providerItemsDownload,
      insurerItemsDownload,
      companyItemsDownload,
    ],
    data: () => ({
      loading: 0,
      editedItem: {},
      aisInfo: {},
      activeTab: 0,
      vesselContactItems: [],
      vesselVrp: {},
      companyLabel: {},
      checkVesselGeneralTabs,
    }),
    computed: {
      ...mapState({
        role: state => state.authentication.role,
      }),
      vrpListItems () {
        return [
          {
            model: this.vesselVrp.vessel_name,
            icon: 'mdi-ferry',
            label: 'Vessel Name',
          },
          {
            model: this.vesselVrp.vessel_type,
            icon: 'mdi-tag',
            label: 'Type',
          },
          {
            model: this.vesselVrp.imo,
            icon: 'mdi-fingerprint',
            label: 'IMO Number',
          },
          {
            model: this.vesselVrp.official_number,
            icon: 'mdi-format-list-numbered',
            label: 'Official Number',
          },
          {
            model: this.vesselVrp.vessel_status,
            icon: 'mdi-check',
            label: 'Vessel Status',
          },
          {
            model: this.vesselVrp.vrp_plan_status,
            icon: 'mdi-check',
            label: 'Plan Status',
          },
          {
            model: this.vesselVrp.plan_holder,
            icon: 'mdi-send',
            label: 'Plan Holder',
          },
          {
            model: this.vesselVrp.primary_smff,
            icon: 'mdi-key-star',
            label: 'Primary SMFF',
          },
          {
            model: this.vesselVrp.vessel_is_tank === 1 ? 'YES' : 'NO',
            icon: 'mdi-gas-cylinder',
            label: 'Tank',
          },
          {
            model: this.vesselVrp.vrp_count,
            icon: 'mdi-history',
            label: 'VRP Count',
          },
          {
            model: this.vesselVrp.vrp_plan_number,
            icon: 'mdi-file-document-edit',
            label: 'Plan Number',
          },
          {
            model: this.vesselVrp.wcd_barrels,
            icon: 'mdi-barrel',
            label: 'WCD Barrels',
          },
        ]
      },
    },
    watch: {
      'editedItem.company_id' () {
        this.getVesselContactItems()
      },
    },
    mounted () {
      this.getDataFromApi()
    },
    methods: {
      ...mapActions({
        showSnackBar: 'showSnackBar',
      }),
      getDataFromApi () {
        this.loading += 3
        axios.get('vessels/' + this.$route.params.id)
          .then(res => {
            this.editedItem = res.data.data[0]
            this.getVesselContactItems()
            this.loading--
          })
        axios.get(`vessels/${this.$route.params.id}/vrp`)
          .then(res => {
            this.vesselVrp = res.data
            this.loading--
          })
        axios.get('vessels/' + this.$route.params.id + '/ais')
          .then(res => {
            this.aisInfo = res.data.data[0]
            this.loading--
          })
      },
      getVesselContactItems () {
        if (this.editedItem.company_id) {
          axios.get('companies/' + this.editedItem.company_id + '/contacts')
            .then(res => {
              this.vesselContactItems = res.data.data
            })
        } else {
          this.vesselContactItems = []
        }
      },
      saveVessel () {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        axios.post('vessels/' + this.$route.params.id, this.editedItem)
          .then(res => {
            this.showSnackBar({ text: res.data.message, color: 'success' })
            this.getDataFromApi()
          })
          .catch(error => {
            this.showSnackBar({ text: error.response.data.message || error.response.statusText, color: 'error' })
          })
      },
      deleteVessel () {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        this.$confirm('You are about to delete this vessel. Are you sure that you want to proceed?', {
          title: 'Warning',
        })
          .then(res => {
            if (res) {
              axios.delete('vessels/' + this.editedItem.id + '/destroy')
                .then(res => {
                  this.$router.push('/vessels')
                  this.showSnackBar({ text: res.data.message, color: 'success' })
                })
                .catch(error => {
                  this.showSnackBar({ text: error.response.data.message || error.response.statusText, color: 'error' })
                })
            }
          })
      },
    },
  }
</script>

<style lang="sass">
  .tabs-container
    margin-top: 2rem
  .vessel-info-heading
    margin-left: 2rem
</style>
