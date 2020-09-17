<template>
  <v-container fluid>
    <base-material-tabs
      v-model="mainTab"
      background-color="transparent"
      centered
      icons-and-text
      show-arrows
      color="secondary"
    >
      <v-tab
        v-for="(tab, i) in mainTabs"
        :key="i"
      >
        {{ tab.name }}
        <v-icon v-text="tab.icon" />
      </v-tab>

      <v-tabs-items
        v-model="mainTab"
        class="transparent"
      >
        <v-tab-item>
          <v-row>
            <v-col
              cols="12"
              sm="8"
            >
              <base-material-card
                color="primary"
              >
                <v-progress-linear
                  v-if="loading"
                  indeterminate
                />
                <template v-slot:heading>
                  <div class="display-1 font-weight-light">
                    VRP Express Information (Imported)
                  </div>
                </template>
                <v-card-text v-if="planHolder">
                  <v-row>
                    <v-col
                      v-for="(item, i) in fieldData"
                      :key="i"
                      cols="12"
                      sm="6"
                    >
                      <v-text-field
                        v-model="planHolder[item.att]"
                        :label="item.label"
                        readonly
                      />
                    </v-col>
                  </v-row>
                  <v-expansion-panels
                    accordion
                    flat
                  >
                    <v-expansion-panel>
                      <v-expansion-panel-header
                        class="display-2 secondary--text"
                      >
                        Plan Holder Address
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-row>
                          <v-col
                            v-for="(item, i) in fieldData1"
                            :key="i"
                            cols="12"
                            sm="6"
                          >
                            <v-text-field
                              v-model="planHolder[item.att]"
                              :label="item.label"
                              readonly
                            />
                          </v-col>
                        </v-row>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-card-text>
                <v-card-text v-else>
                  <base-material-alert
                    color="warning"
                    dark
                  >
                    No VRP Link
                  </base-material-alert>
                </v-card-text>
                <v-row
                  align="center"
                  justify="center"
                >
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        fab
                        color="secondary"
                        :loading="importing"
                        v-on="on"
                        @click="importCompany"
                      >
                        <v-icon size="30">
                          mdi-import
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Import To CDT</span>
                  </v-tooltip>
                </v-row>
              </base-material-card>
            </v-col>
            <v-col
              cols="12"
              sm="4"
            >
              <base-material-card
                class="v-card-profile cdt-info-card"
                image
                color="white"
                hover-reveal
              >
                <v-progress-linear
                  v-if="loading"
                  indeterminate
                />
                <template v-slot:image>
                  <v-icon
                    size="100"
                    color="grey"
                  >
                    mdi-domain
                  </v-icon>
                </template>
                <v-card-text
                  v-if="planHolder"
                  class="text-center"
                >
                  <h4 class="display-2 font-weight-light mb-3 black--text">
                    {{ planHolder.plan_holder }}
                  </h4>
                  <h6 class="display-1 mb-1 grey--text">
                    Plan Number: {{ planHolder.plan_number }}
                  </h6>
                </v-card-text>
              </base-material-card>
            </v-col>
          </v-row>
        </v-tab-item>

        <v-tab-item>
          <base-material-card
            color="primary"
            title="VRP Vessels"
          >
            <v-row
              align="end"
            >
              <v-text-field
                v-model="searchVessel"
                append-icon="mdi-magnify"
                class="ml-auto mr-3"
                label="Search"
                hide-details
                single-line
                clearable
                style="max-width: 200px;"
              />
            </v-row>
            <v-progress-linear
              v-if="loading"
              indeterminate
            />
            <v-data-table
              v-if="vrpVessels"
              class="mt-5"
              :headers="headers"
              :items="vrpVessels"
              :search="searchVessel"
            >
              <template v-slot:body="{ items }">
                <tbody>
                  <tr
                    v-for="(item, i) in items"
                    :key="i"
                    class="vrp-sql"
                  >
                    <td class="pl-5">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <span
                            dark
                            v-on="on"
                          >
                            <v-badge
                              slot="activator"
                              left
                              :color="item.vessel_status === 'Authorized' ? 'success' : 'error'"
                            >
                              <template v-slot:badge>
                                <v-icon dark>
                                  {{ item.vessel_status === 'Authorized' ? 'mdi-check' : 'mdi-close' }}
                                </v-icon>
                              </template>
                              <router-link
                                class="table-link"
                                :to="`/vessels/${item.id}/vrpexpress`"
                              >
                                {{ item.vessel_name | truncate(42) }}
                              </router-link>
                            </v-badge>
                          </span>
                        </template>
                        <span>{{ item.vessel_status }}</span>
                      </v-tooltip>
                    </td>
                    <td>
                      <v-tooltip right>
                        <template v-slot:activator="{ on }">
                          <span
                            dark
                            v-on="on"
                          >
                            {{ item.imo }}
                          </span>
                        </template>
                        <span>{{ item.vessel_status }}</span>
                      </v-tooltip>
                    </td>
                    <td>{{ item.official_number ? item.official_number : '-' }}</td>
                    <td>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <span
                            dark
                            v-on="on"
                          >
                            <v-icon
                              color="gray"
                              size="30"
                            >
                              mdi-shield-search
                            </v-icon>
                          </span>
                        </template>
                        <span>{{ planHolder.primary_smff || 'No Provider' }}</span>
                      </v-tooltip>
                    </td>
                    <td class="pl-5">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <span
                            dark
                            v-on="on"
                          >
                            <v-badge
                              slot="activator"
                              left
                              :color="item.tanker ? 'black' : 'blue'"
                            >
                              <template v-slot:badge>
                                <v-icon dark>
                                  {{ item.tanker ? 'mdi-water' : 'mdi-water-off' }}
                                </v-icon>
                              </template>
                              <span>
                                {{ item.vessel_type }}
                              </span>
                            </v-badge>
                          </span>
                        </template>
                        <span>{{ item.tanker ? 'Tank' : 'Non Tank' }}</span>
                      </v-tooltip>
                    </td>
                    <td>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <span
                            dark
                            v-on="on"
                          >
                            <v-badge
                              slot="activator"
                              :color="item.vessel_status === 'Authorized' ? 'success' : 'error'"
                            >
                              <template v-slot:badge>
                                <v-icon dark>
                                  {{ item.vessel_status === 'Authorized' ? 'mdi-check' : 'mdi-close' }}
                                </v-icon>
                              </template>
                              <span>{{ planHolder.plan_number }}</span>
                            </v-badge>
                          </span>
                        </template>
                        <span>{{ item.vessel_status }}</span>
                      </v-tooltip>
                    </td>
                    <td>
                      <v-speed-dial
                        v-model="fab[item.id]"
                        direction="left"
                      >
                        <template v-slot:activator>
                          <v-btn
                            v-model="fab[item.id]"
                            fab
                            small
                            color="primary"
                            :loading="importing && index === i"
                          >
                            <v-icon v-if="fab[item.id]">
                              mdi-close
                            </v-icon>
                            <v-icon v-else>
                              mdi-chevron-left
                            </v-icon>
                          </v-btn>
                        </template>
                        <v-btn
                          fab
                          x-small
                          color="primary"
                          :to="`/vessels/${item.id}/vrpexpress`"
                        >
                          <v-icon color="white">
                            mdi-eye
                          </v-icon>
                        </v-btn>
                        <v-btn
                          fab
                          x-small
                          color="secondary"
                          @click="importVessel(item.id); index = i"
                        >
                          <v-icon>mdi-import</v-icon>
                        </v-btn>
                      </v-speed-dial>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-data-table>
          </base-material-card>
        </v-tab-item>
      </v-tabs-items>
    </base-material-tabs>
  </v-container>
</template>

<script>
  import axios from 'axios'
  import { mapActions, mapState } from 'vuex'
  import { checkCUD } from '@/shared/management'

  export default {
    data: () => ({
      loading: false,
      importing: false,
      index: -1,
      planHolder: null,
      fab: {},
      vrpVessels: [],
      fieldData: [
        { label: 'Plan Holder Name', att: 'plan_holder' },
        { label: 'Plan Number', att: 'plan_number' },
        { label: 'Plan Preparer', att: 'plan_preparer' },
        { label: 'Plan Type', att: 'plan_type' },
        { label: 'Plan Approved', att: 'approval_date' },
        { label: 'Status', att: 'status' },
        { label: 'Plan Expiration', att: 'plan_exp_date' },
        { label: 'WCD', att: 'wcd_barrels' },
        { label: 'Tank Expiration', att: 'tank_expiration_date' },
        { label: 'SMFF Provider', att: 'primary_smff' },
        { label: 'Non-Tank Expiration', att: 'nt_expiration_date' },
        { label: 'OSRO', att: 'osro' },
      ],
      fieldData1: [
        { label: 'Address 1', att: 'holder_address_1' },
        { label: 'Address 2', att: 'holder_address_2' },
        { label: 'City', att: 'holder_city' },
        { label: 'State', att: 'holder_state' },
        { label: 'Country', att: 'holder_country' },
        { label: 'Zip', att: 'holder_zip' },
      ],
      mainTab: 0,
      mainTabs: [
        { name: 'Planholder', icon: 'mdi-notebook' },
        { name: 'Vessels', icon: 'mdi-ferry' },
      ],
      headers: [
        { text: 'Vessel Name', value: 'vessel_name' },
        { text: 'IMO', value: 'imo' },
        { text: 'Official #', value: 'official_number' },
        { text: 'Status', value: 'vessel_status', sortable: false },
        { text: 'Vessel Type', value: 'vessel_type', sortable: false },
        { text: 'Plan', value: 'plan_number', sortable: false },
        { text: 'Action', value: 'action', sortable: false },
      ],
      searchVessel: '',
    }),
    computed: {
      ...mapState({
        role: state => state.authentication.role,
      }),
    },
    mounted () {
      this.getDataFromApi()
    },
    methods: {
      ...mapActions({
        showSnackBar: 'showSnackBar',
      }),
      getDataFromApi () {
        this.loading = true
        const planNumber = this.$route.params.id
        const tankers = ['TANK (Primary)', 'TANK (Primary)/SMPEP', 'TANK/SOPEP', 'TANK (Secondary)', 'TANK (Secondary)/SOPEP']
        axios.get('companies/VRPexpress/' + planNumber)
          .then(res => {
            this.planHolder = res.data.plan_detail
            this.vrpVessels = res.data.vrp_vessels && res.data.vrp_vessels.map(vessel => ({ ...vessel, tanker: tankers.includes(vessel.vessel_is_tank) }))
            this.loading = false
          })
      },
      async importVessel (id) {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        this.importing = true
        try {
          const response = await axios.post('vessels/' + id + '/import')
          response.data.success
            ? this.showSnackBar({ text: response.data.message, color: 'success' })
            : this.showSnackBar({ text: response.data.message, color: 'error' })
        } catch (err) {
          this.showSnackBar({ text: err, color: 'error' })
        }
        this.importing = false
      },
      async importCompany () {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        this.importing = true
        try {
          const response = await axios.post('companies/' + this.$route.params.id + '/import')
          response.data.success
            ? this.showSnackBar({ text: response.data.message, color: 'success' })
            : this.showSnackBar({ text: response.data.message, color: 'error' })
        } catch (err) {
          this.showSnackBar({ text: err, color: 'error' })
        }
        this.importing = false
      },
    },
  }
</script>

<style lang="sass">
  .vrp-sql
    background-color: #f7f7f7
    td, a
      color: gray !important
</style>
