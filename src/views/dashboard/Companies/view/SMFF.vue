<template>
  <v-container class="company-capability">
    <template v-if="smff">
      <v-row>
        <v-col
          cols="12"
          sm="4"
        >
          <base-material-card
            color="secondary"
            title="Capabilities"
          >
            <v-progress-linear
              v-if="loading"
              indeterminate
            />
            <v-expansion-panels
              accordion
              flat
            >
              <v-expansion-panel
                v-for="capability in capabilities"
                :key="capability.code"
                :class="capability.subs ? '' : 'no-down-icon'"
              >
                <v-expansion-panel-header
                  class="subtitle-1 font-weight-bold"
                  @click="!capability.subs && changePage(capability)"
                >
                  {{ capability.main }}
                </v-expansion-panel-header>
                <v-expansion-panel-content
                  v-if="capability.subs"
                >
                  <v-row
                    v-for="sub in capability.subs"
                    :key="sub.code"
                    @click="changePage(sub)"
                  >
                    <v-col
                      class="ml-5"
                      style="cursor: pointer;"
                    >
                      {{ sub.main }}
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </base-material-card>
        </v-col>
        <v-col
          v-if="page.code === 11"
          cols="12"
          sm="8"
        >
          <base-material-card
            color="primary"
            :title="page.main + ' - ' + companyName"
          >
            <v-row
              class="pa-7"
            >
              <v-progress-linear
                v-if="loading"
                indeterminate
              />
              <v-autocomplete
                v-model="smff.primary_service"
                :items="serviceItems"
                item-text="label"
                item-value="id"
                label="Select Primary Service"
                prepend-icon="mdi-star"
              >
                <template v-slot:item="{ item }">
                  <v-list-item-content>
                    <v-list-item-title
                      :style="`color: ${item.code.charAt(0) === 'm' ? 'red':'black'}`"
                      @change="notSaved = true"
                      v-text="item.label"
                    />
                  </v-list-item-content>
                </template>
              </v-autocomplete>
            </v-row>
          </base-material-card>
        </v-col>
        <v-col
          v-else-if="page.code === 12"
          cols="12"
          sm="8"
        >
          <base-material-card
            color="primary"
            :title="page.main + ' - ' + companyName"
          >
            <v-progress-linear
              v-if="loading"
              indeterminate
            />
            <v-expansion-panels
              v-else
              accordion
              flat
            >
              <v-expansion-panel
                v-for="(salvage, i) in Object.keys(salvage_service)"
                :key="i"
              >
                <v-expansion-panel-header
                  class="subtitle-1 font-weight-bold"
                >
                  {{ salvage }}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row
                    v-for="(item, j) in salvage_service[salvage]"
                    :key="j"
                  >
                    <v-col>
                      <v-checkbox
                        v-model="smff[item.model]"
                        color="primary"
                        :label="item.title"
                        hide-details
                        :prepend-icon="item.icon"
                        @change="notSaved = true"
                      />
                      <v-row
                        v-if="smff.s_emergency_towing && item.model === 's_emergency_towing'"
                        class="pl-10 ml-2"
                      >
                        <v-col cols="12">
                          <v-select
                            v-model="smff.s_tug_type"
                            :items="['Conventional', 'Azimuth stern drive', 'Tractor']"
                            hide-details
                            clearable
                            label="Tug Type"
                            @change="notSaved = true"
                          />
                          <v-text-field
                            v-model="smff.s_horsepower"
                            label="Horsepower"
                            hide-details
                            type="number"
                            @change="notSaved = true"
                          />
                          <v-text-field
                            v-model="smff.s_bollard_pull"
                            label="Bollard Pull"
                            hide-details
                            type="number"
                            @change="notSaved = true"
                          />
                          <v-text-field
                            v-model="smff.s_subchapter_m"
                            label="Subchapter M"
                            hide-details
                            @change="notSaved = true"
                          />
                        </v-col>
                      </v-row>
                      <v-row
                        v-if="smff.s_emergency_lightering && item.model === 's_emergency_lightering'"
                        class="pl-10 ml-2"
                      >
                        <v-col cols="12">
                          <v-checkbox
                            v-model="smff.s_capacity_bbl"
                            color="primary"
                            label="Floating or land-based receptacle(s)"
                            hide-details
                            @change="notSaved = true"
                          />
                          <v-text-field
                            v-if="smff.s_capacity_bbl"
                            v-model="smff.s_capacity_bbl_value"
                            label="Capacity in BBL"
                            hide-details
                            @change="notSaved = true"
                          />
                        </v-col>
                      </v-row>
                      <v-row
                        v-if="smff.s_heavy_lift && item.model === 's_heavy_lift'"
                        class="pl-10 ml-2"
                      >
                        <v-col cols="12">
                          <v-text-field
                            v-model="smff.s_lifting_gear_minimum_swl"
                            type="number"
                            label="Lifting Gear Minimum SWL"
                            hide-details
                            @change="notSaved = true"
                          />
                          <v-text-field
                            v-model="smff.s_largest_cargo_gear"
                            label="Largest Cargo Gear"
                            hide-details
                            @change="notSaved = true"
                          />
                          <v-text-field
                            v-model="smff.s_lifting_gear_reach"
                            type="number"
                            label="Lifting Gear Reach"
                            hide-details
                            @change="notSaved = true"
                          />
                          <v-text-field
                            v-model="smff.s_available_deck_space"
                            type="number"
                            label="Available Deck Space"
                            hide-details
                            @change="notSaved = true"
                          />
                          <v-text-field
                            v-model="smff.s_available_deck_space_location"
                            label="Available Deck Space Location"
                            hide-details
                            @change="notSaved = true"
                          />
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </base-material-card>
        </v-col>
        <v-col
          v-else-if="page.code === 13"
          cols="12"
          sm="8"
        >
          <base-material-card
            color="primary"
            :title="page.main + ' - ' + companyName"
          >
            <v-progress-linear
              v-if="loading"
              indeterminate
            />
            <v-expansion-panels
              v-else
              flat
              accordion
            >
              <v-expansion-panel
                v-for="(fire, index) in Object.keys(marine_firefighting)"
                :key="index"
              >
                <v-expansion-panel-header class="subtitle-1 font-weight-bold">
                  {{ fire }}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row
                    v-for="(single, k) in marine_firefighting[fire]"
                    :key="k"
                  >
                    <v-col>
                      <v-checkbox
                        v-model="smff[single.model]"
                        color="primary"
                        :label="single.title"
                        hide-details
                        :prepend-icon="single.icon"
                        @change="notSaved = true"
                      />
                      <v-row
                        v-if="smff.mff_external_vessel_firefighting_systems && single.model === 'mff_external_vessel_firefighting_systems'"
                        class="pl-10 ml-2"
                      >
                        <v-col cols="12">
                          <v-select
                            v-model="smff.mff_class_classification"
                            label="Class classification"
                            hide-details
                            :items="['Not Applicable', 'FiFi 1', 'FiFi 2', 'FiFi 3']"
                            @change="updatePumpingCapacity"
                          />
                          <v-text-field
                            v-model="smff.mff_pumping_capacity"
                            label="Pumping capacity"
                            hide-details
                            suffix="(gpm)"
                            type="number"
                            @change="notSaved = true"
                          />
                          <v-text-field
                            v-model="smff.mff_foam_quantity"
                            type="number"
                            label="Foam quantity"
                            hide-details
                            @change="notSaved = true"
                          />
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </base-material-card>
        </v-col>
        <v-col
          v-else-if="page.code === 2"
          cols="12"
          sm="8"
        >
          <base-material-card
            color="primary"
            :title="page.main + ' - ' + companyName"
          >
            <v-progress-linear
              v-if="loading"
              indeterminate
            />
            <v-row v-else>
              <v-col
                cols="12"
                class="pa-7"
              >
                <v-text-field
                  v-model="smff.acd_passenger_capacity"
                  type="number"
                  label="Passenger Capacity (Number Input)"
                  hide-details
                  prepend-icon="mdi-seat-passenger"
                />
                <v-text-field
                  v-model="smff.acd_heli_landing_capacity"
                  type="number"
                  label="Helicopter Capability Landing Size/Capacity"
                  hide-details
                  prepend-icon="mdi-alpha-h-circle-outline"
                />
                <v-text-field
                  v-model="smff.acd_heli_drop_zone_size"
                  type="number"
                  label="Helicopter Capability Drop-zone Size"
                  hide-details
                  prepend-icon="mdi-helicopter"
                />
                <v-text-field
                  v-model="smff.acd_small_boat_size"
                  type="number"
                  label="Small Boat Capability Size"
                  hide-details
                  prepend-icon="mdi-sail-boat"
                />
                <v-text-field
                  v-model="smff.acd_small_boat_capacity"
                  type="number"
                  label="Small Boat Capability Capacity"
                  hide-details
                  prepend-icon="mdi-counter"
                />
                <v-select
                  v-model="smff.acd_medical_personnel_onboard"
                  :items="['Medical doctor / physician normally carried', 'Physician\'s assistant or paramedic normally carried', 'Nurse normally carried', 'No medically trained personnel normally carried']"
                  clearable
                  label="Medical Personnel Onboard"
                  hide-details
                  prepend-icon="mdi-doctor"
                />
                <v-select
                  v-model="smff.acd_radio_watch_schedule"
                  :items="['H24-Continuous', 'H16-ITU SKED', 'H8-ITU SKED', 'HX Unspecified']"
                  clearable
                  label="Radio Watch Schedule"
                  hide-details
                  prepend-icon="mdi-radio-handheld"
                />
                <v-checkbox
                  v-model="smff.s_heavy_lift"
                  color="primary"
                  label="Heavy lift"
                  hide-details
                  prepend-icon="mdi-pier-crane"
                  @change="notSaved = true"
                />
                <v-row
                  v-if="smff.s_heavy_lift"
                  class="pl-10 ml-2"
                >
                  <v-col cols="12">
                    <v-text-field
                      v-model="smff.s_lifting_gear_minimum_swl"
                      type="number"
                      label="Lifting Gear Minimum SWL"
                      hide-details
                      @change="notSaved = true"
                    />
                    <v-text-field
                      v-model="smff.s_largest_cargo_gear"
                      label="Largest Cargo Gear"
                      hide-details
                      @change="notSaved = true"
                    />
                    <v-text-field
                      v-model="smff.s_lifting_gear_reach"
                      type="number"
                      label="Lifting Gear Reach"
                      hide-details
                      @change="notSaved = true"
                    />
                    <v-text-field
                      v-model="smff.s_available_deck_space"
                      type="number"
                      label="Available Deck Space"
                      hide-details
                      @change="notSaved = true"
                    />
                    <v-text-field
                      v-model="smff.s_available_deck_space_location"
                      label="Available Deck Space Location"
                      hide-details
                      @change="notSaved = true"
                    />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </base-material-card>
        </v-col>
        <v-col
          v-else-if="page.code === 3"
          cols="12"
          sm="8"
        >
          <base-material-card
            color="primary"
            :title="page.main + ' - ' + companyName"
          >
            <v-progress-linear
              v-if="loading"
              indeterminate
            />
            <v-row v-else>
              <v-col
                cols="12"
                class="pa-7"
              >
                <v-checkbox
                  v-model="smff.acd_logistics_asset"
                  color="primary"
                  label="Logistics Asset"
                  hide-details
                  @change="notSaved = true"
                />
              </v-col>
            </v-row>
          </base-material-card>
        </v-col>
        <v-col
          v-else-if="page.code === 4"
          cols="12"
          sm="8"
        >
          <base-material-card
            color="primary"
            :title="page.main + ' - ' + companyName"
          >
            <v-progress-linear
              v-if="loading"
              indeterminate
            />
            <v-row v-else>
              <v-col
                cols="12"
                class="pa-7"
              >
                <v-textarea
                  v-model="smff.notes"
                  auto-grow
                  label="Notes"
                  @change="notSaved = true"
                />
              </v-col>
            </v-row>
          </base-material-card>
        </v-col>
        <v-col
          v-else
          cols="12"
          sm="8"
        >
          <base-material-card
            color="primary"
            :title="companyName"
          >
            <v-progress-linear
              v-if="loading"
              indeterminate
            />
            <v-card-text class="text-center">
              <v-img
                v-if="hasPhoto"
                :src="`https://storage.googleapis.com/donjon-smit/pictures/companies/${$route.params.id}/cover_sqr.jpg`"
                class="img-avatar"
              />
              <v-icon
                v-else
                size="100"
                color="grey"
              >
                mdi-domain
              </v-icon>
              <h4 class="display-2 font-weight-light mb-3 black--text">
                {{ companyName }}
              </h4>
              <h6 class="display-1 mb-1 grey--text">
                VRP Number: {{ planNumber }}
              </h6>
            </v-card-text>
          </base-material-card>
        </v-col>
        <v-dialog
          v-model="saveChanges"
          max-width="500"
        >
          <v-card>
            <v-card-title
              class="headline title-color"
            >
              Confirm Navigation
            </v-card-title>
            <v-card-text>
              Do you want to discard changes?
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="success"
                class="ma-1"
                elevation="1"
                @click="saveChanges = false"
              >
                <v-icon
                  class="v-alert__icon"
                >
                  mdi-check
                </v-icon>
                NO, STAY ON SECTION
              </v-btn>
              <v-btn
                color="warning"
                class="ma-1"
                elevation="1"
                @click="discardChanges"
              >
                <v-icon
                  class="v-alert__icon"
                >
                  mdi-alert
                </v-icon>
                DISCARD CHANGES
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <v-row>
        <v-spacer />
        <v-btn
          color="primary"
          @click="saveSMFF"
        >
          Save Changes
        </v-btn>
      </v-row>
    </template>
    <template v-else>
      <v-row>
        <v-col
          cols="12"
          sm="4"
        >
          <base-material-card
            color="secondary"
            title="Capabilities"
          >
            <base-material-alert
              v-if="!smff"
              color="warning"
              dark
            >
              {{ companyName }} Has No Assigned Capabilities.
            </base-material-alert>
          </base-material-card>
        </v-col>
        <v-col>
          <base-material-card
            color="primary"
            :title="companyName + ' Has No Assigned Capabilities.'"
          >
            <v-card-text class="text-center">
              <v-icon
                size="100"
                color="grey"
              >
                mdi-domain
              </v-icon>
            </v-card-text>
            <v-card-text class="text-center">
              <v-btn
                color="primary"
                @click="createSMFF"
              >
                Create Capabilities
              </v-btn>
            </v-card-text>
          </base-material-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script>
  import axios from 'axios'
  import { mapActions, mapState } from 'vuex'
  import { checkCUD } from '@/shared/management'

  export default {
    data: () => ({
      capabilities: [
        {
          code: 1,
          main: 'Salvage and Marine Firefighting',
          subs: [
            { code: 11, main: 'Primary SMFF Service' },
            { code: 12, main: 'Salvage Services' },
            { code: 13, main: 'Marine Firefighting Services' },
          ],
        },
        {
          code: 2,
          main: 'NASA',
        },
        {
          code: 3,
          main: 'Logistics',
        },
        {
          code: 4,
          main: 'Notes',
        },
      ],
      smff: {},
      salvage_service: {
        '(i) Assessement & Survey': [
          { title: 'Remote assessment and consultation', icon: 'mdi-phone-in-talk', model: 's_remote_assessment_and_consultation' },
          { title: 'Begin assessment of structural stability', icon: 'mdi-android-studio', model: 's_begin_assessment_of_structural_stability' },
          { title: 'On-site salvage assessment', icon: 'mdi-account-hard-hat', model: 's_onsite_salvage_assessment' },
          { title: 'Assessment of structural stability', icon: 'mdi-android-studio', model: 's_assessment_of_structural_stability' },
          { title: 'Hull and bottom survey', icon: 'mdi-diving-helmet', model: 's_hull_and_bottom_survey' },
        ],
        '(ii) Stabilization': [
          { title: 'Emergency towing', icon: 'mdi-ferry', model: 's_emergency_towing' },
          { title: 'Salvage Plan', icon: 'mdi-file-document-edit', model: 's_salvage_plan' },
          { title: 'External emergency transfer operation', icon: 'mdi-swap-horizontal-bold', model: 's_external_emergency_transfer_operations' },
          { title: 'Emergency lightering', icon: 'mdi-transfer', model: 's_emergency_lightering' },
          { title: 'Other refloating methods', icon: 'mdi-water-pump', model: 's_other_refloating_methods' },
          { title: 'Making temporary repairs', icon: 'mdi-wrench', model: 's_making_temporary_repairs' },
          { title: 'Diving Services support', icon: 'mdi-diving-helmet', model: 's_diving_services_support' },
        ],
        '(iii) Specialized Salvage Operations': [
          { title: 'Special salvage operations plan', icon: 'mdi-file-document-edit', model: 's_special_salvage_operations_plan' },
          { title: 'Subsurface product removal', icon: 'mdi-arrow-collapse-up', model: 's_subsurface_product_removal' },
          { title: 'Heavy lift', icon: 'mdi-pier-crane', model: 's_heavy_lift' },
        ],
      },
      marine_firefighting: {
        '(i) Assessment & Planning': [
          { title: 'Remote Assessment and consultation', icon: 'mdi-phone-in-talk', model: 'mff_remote_assessment_and_consultation' },
          { title: 'On-site fire assessment', icon: 'mdi-account-hard-hat', model: 'mff_onsite_fire_assessment' },
        ],
        '(ii) Fire Suppression': [
          { title: 'External firefighting teams', icon: 'mdi-account-hard-hat', model: 'mff_external_firefighting_teams' },
          { title: 'External vessel firefighting systems', icon: 'mdi-fire-extinguisher', model: 'mff_external_vessel_firefighting_systems' },
        ],
      },
      page: 0,
      companyName: '',
      loading: false,
      hasPhoto: false,
      to: null,
      next: null,
      saveChanges: false,
      networks: [],
      serviceItems: [],
      notSaved: false,
      planNumber: '',
    }),
    computed: {
      ...mapState({
        role: state => state.authentication.role,
      }),
    },
    mounted () {
      this.getDataFromApi()
    },

    beforeRouteLeave (to, from, next) {
      if (!this.notSaved) {
        next()
      } else {
        this.saveChanges = true
        this.to = to
        this.next = next
      }
    },
    methods: {
      ...mapActions({
        showSnackBar: 'showSnackBar',
      }),
      changePage (category) {
        this.page = category
      },
      getDataFromApi () {
        this.loading++
        axios.get('companies/' + this.$route.params.id + '/smff')
          .then(res => {
            this.networks = res.data.networks
            this.smff = res.data.smff
            this.serviceItems = res.data.serviceItems
          })
          .catch(err => {
            this.showSnackBar({ text: err, color: 'error' })
          })
          .finally(() => {
            this.loading--
          })

        this.loading++
        axios.get('companies/' + this.$route.params.id)
          .then(res => {
            this.companyName = res.data.data[0].name
            this.planNumber = res.data.data[0].plan_number
            this.hasPhoto = res.data.data[0].has_photo
          })
          .catch(err => {
            this.showSnackBar({ text: err, color: 'error' })
          })
          .finally(() => {
            this.loading--
          })
      },
      createSMFF () {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        axios.post('companies/' + this.$route.params.id + '/smff/create')
          .then(res => {
            this.showSnackBar({ text: res.data.message, color: 'success' })
            this.getDataFromApi()
          }).catch(error => {
            if (error.response && error.response.data) {
              this.showSnackBar({ text: error.response.data.message || error.response.statusText, color: 'error' })
            }
          })
      },
      deleteSMFF () {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        this.$confirm('Please confirm that you would like to delete the SMFF Service', { title: 'Warning' })
          .then(res => {
            if (res) {
              axios.delete('companies/' + this.$route.params.id + '/smff')
                .then(res => {
                  this.showSnackBar({ text: res.data.message, color: 'success' })
                  this.getDataFromApi()
                }).catch(error => {
                  if (error.response && error.response.data) {
                    this.showSnackBar({ text: error.response.data.message || error.response.statusText, color: 'error' })
                  }
                })
            }
          })
      },
      saveSMFF () {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        const data = {
          smff: this.smff,
          networks: this.networks,
        }
        axios.post('companies/' + this.$route.params.id + '/smff', data)
          .then(res => {
            this.notSaved = false
            this.getDataFromApi()
            this.showSnackBar({ text: res.data.message, color: 'success' })
          }).catch(error => {
            if (error.response && error.response.data) {
              this.showSnackBar({ text: error.response.data.message || error.response.statusText, color: 'error' })
            }
          })
      },
      discardChanges () {
        this.saveChanges = false
        this.next()
      },
      updatePumpingCapacity () {
        if (!this.smff.mff_pumping_capacity) {
          switch (this.smff.mff_class_classification) {
            case 'FiFi 1':
              this.smff.mff_pumping_capacity = 10.569
              break
            case 'FiFi 2':
              this.smff.mff_pumping_capacity = 31.704
              break
            case 'FiFi 3':
              this.smff.mff_pumping_capacity = 42.272
              break
          }
        }
        this.notSaved = true
      },
    },
  }
</script>

<style lang="sass">
  .no-down-icon
    .v-expansion-panel-header__icon
      display: none
</style>
