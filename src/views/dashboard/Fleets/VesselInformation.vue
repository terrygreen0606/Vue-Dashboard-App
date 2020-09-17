<template>
  <v-container
    fluid
    tag="section"
  >
    <base-material-card
      color="primary"
      icon="mdi-ferry"
      inline
    >
      <template v-slot:after-heading>
        <div class="display-2">
          Fleets / Vessel Info
        </div>
        <div class="display-1">
          {{ fleetName }}
        </div>
      </template>

      <v-row align="end">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          class="ml-auto mr-3"
          label="Search"
          hide-details
          single-line
          clearable
          style="max-width: 160px;"
        />
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              color="warning"
              small
              class="mr-2"
              v-on="on"
              @click="addVessel = true"
            >
              <v-icon size="28">
                mdi-plus-circle-outline
              </v-icon>
            </v-btn>
          </template>
          <span>Add Vessel</span>
        </v-tooltip>
      </v-row>
      <v-data-table
        :headers="headers"
        :items="fleets.vessels"
        :options.sync="options"
        :loading="!!loading"
        :hide-default-footer="true"
        class="mt-5"
      >
        <template v-slot:item="fleet">
          <tr>
            <td>
              <router-link
                class="table-link"
                :to="'/vessels/' + fleet.item.id"
              >
                {{ fleet.item.name | truncate(42) }}
              </router-link>
            </td>
            <td>
              <span>{{ fleet.item.imo }}</span>
            </td>
            <td>
              <span>{{ fleet.item.official_number }}</span>
            </td>
            <td>
              <v-speed-dial
                v-model="fab[fleet.item.id]"
                direction="left"
              >
                <template v-slot:activator>
                  <v-btn
                    v-model="fab[fleet.item.id]"
                    fab
                    small
                    color="primary"
                  >
                    <v-icon v-if="fab[fleet.item.id]">
                      mdi-close
                    </v-icon>
                    <v-icon v-else>
                      mdi-chevron-left
                    </v-icon>
                  </v-btn>
                </template>
                <v-tooltip
                  bottom
                >
                  <template v-slot:activator="{ on }">
                    <span
                      dark
                      v-on="on"
                    >
                      <v-btn
                        fab
                        x-small
                        color="error"
                        @click="deleteVesselFromFleet(fleet.item.id)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </span>
                  </template>
                  <span>Remove from Fleet</span>
                </v-tooltip>
                <v-tooltip
                  bottom
                >
                  <template v-slot:activator="{ on }">
                    <span
                      dark
                      v-on="on"
                    >
                      <router-link
                        class="table-link"
                        :to="'/vessels/' + fleet.item.id"
                      >
                        <v-btn
                          fab
                          x-small
                          color="success"
                        >
                          <v-icon>mdi-eye-check</v-icon>
                        </v-btn>
                      </router-link>
                    </span>
                  </template>
                  <span>View Vessel Info</span>
                </v-tooltip>
              </v-speed-dial>
            </td>
          </tr>
        </template>
      </v-data-table>
      <table-footer
        :options="options"
        :total="total"
      />
    </base-material-card>
    <v-dialog
      v-model="addVessel"
      max-width="500"
    >
      <v-card>
        <v-card-title class="headline">
          Add Vessel
        </v-card-title>
        <v-divider />
        <v-progress-linear
          v-if="vesselInfoLoading || !vesselInfo.length"
          indeterminate
        />
        <v-card-text v-else>
          <v-autocomplete
            v-model="newVessel"
            :items="vesselInfo"
            item-text="name"
            item-value="id"
            prepend-icon="mdi-ferry"
            label="Vessel Name"
            class="mr-5 ml-5"
          />
          <v-autocomplete
            v-model="newVessel"
            :items="vesselInfo"
            item-text="imo"
            item-value="id"
            prepend-icon="mdi-fingerprint"
            label="Vessel IMO"
            class="mr-5 ml-5"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="error"
            @click="addVessel = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="success"
            @click="addNewVessel"
          >
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import axios from 'axios'
  import { mapActions, mapState } from 'vuex'
  import { vesselInfoDownload } from '@/mixins/menuItemsDownload/vesselInfoDownload'
  import { fleetItemsDownload } from '@/mixins/menuItemsDownload/fleetItemsDownload'
  import { checkCUD } from '@/shared/management'

  export default {
    components: {
      TableFooter: () => import('../components/TableFooter'),
    },

    mixins: [
      vesselInfoDownload,
      fleetItemsDownload,
    ],

    data: () => ({
      search: '',
      headers: [
        {
          text: 'Vessel Name',
          value: 'name',
        },
        {
          text: 'IMO',
          value: 'imo',
        },
        {
          text: 'Official #',
          value: 'type',
        },
        {
          text: 'Actions',
          value: 'ext',
        },
      ],
      staticSearch: {
        internal: -1,
      },
      fleets: [],
      total: 0,
      options: {},
      loading: 0,
      fab: {},
      addVessel: false,
      newVessel: null,
      newVesselData: {},
      destroyVessel: {},
    }),
    computed: {
      ...mapState({
        role: state => state.authentication.role,
      }),
      fleetName () {
        const id = parseInt(this.$route.params.id)
        return (this.fleetItems.find(item => item.id === id) || {}).name
      },
    },
    watch: {
      options: {
        handler () {
          this.getDataFromApi()
        },
        deep: true,
      },

      addVessel: function (value) {
        if (value) {
          this.vesselInfoDownload()
        }
      },
    },
    methods: {
      ...mapActions({
        showSnackBar: 'showSnackBar',
      }),
      async getDataFromApi () {
        this.loading++
        axios.get('fleets/' + this.$route.params.id)
          .then(res => {
            this.fleets = res.data.data[0]
            this.total = this.fleets.vessels.length
          })
        this.loading--
      },
      addNewVessel () {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        this.addVessel = false
        this.newVesselData = {
          fleet_id: this.$route.params.id,
          vessel_id: this.newVessel,
        }
        axios.post('fleets/addVessel', this.newVesselData)
          .then(res => {
            this.showSnackBar({ text: res.data.message, color: 'success' })
            this.getDataFromApi()
          })
      },
      deleteVesselFromFleet (id) {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        this.destroyVessel = {
          fleet_id: this.$route.params.id,
          vessel_idd: id,
        }
        this.$confirm('Are you sure you want to remove this vessel?', {
          title: 'Warning',
          buttonTrueText: 'Yes',
          buttonFalseText: 'No',
          buttonTrueColor: 'error',
          buttonFalseColor: 'primary',
        })
          .then(res => {
            if (res) {
              axios.delete('fleets/' + this.$route.params.id + '/' + id + '/destroyVessel', this.destroyVessel)
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
    },
  }
</script>
