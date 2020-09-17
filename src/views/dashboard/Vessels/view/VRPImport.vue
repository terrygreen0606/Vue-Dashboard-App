<template>
  <v-container fluid>
    <v-row>
      <v-col
        cols="12"
        sm="8"
      >
        <base-material-card
          color="primary"
        >
          <template v-slot:heading>
            <div class="display-1 font-weight-light">
              VRP Express Information (Imported)
            </div>
          </template>
          <v-progress-linear
            v-if="loading"
            indeterminate
          />
          <v-card-text v-else>
            <v-row v-if="vesselVrp">
              <v-col
                v-for="item in vrpListItems"
                :key="item.key"
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
            <base-material-alert
              v-else
              color="warning"
              dark
            >
              No VRP Link
            </base-material-alert>
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
                    @click="importVessel"
                  >
                    <v-icon size="30">
                      mdi-import
                    </v-icon>
                  </v-btn>
                </template>
                <span>Import To CDT</span>
              </v-tooltip>
            </v-row>
          </v-card-text>
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
          <template v-slot:image>
            <v-icon
              size="100"
              color="grey"
            >
              mdi-ferry
            </v-icon>
          </template>
          <v-progress-linear
            v-if="loading"
            indeterminate
          />
          <v-card-text
            v-else
            class="text-center"
          >
            <h4 class="display-2 font-weight-light mb-3 black--text">
              {{ ((vesselVrp || {}).name) || '' }}
            </h4>
          </v-card-text>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import axios from 'axios'
  import { mapActions, mapState } from 'vuex'
  import { checkCUD } from '@/shared/management'

  export default {
    data: () => ({
      loading: false,
      vesselVrp: {},
      importing: false,
    }),

    computed: {
      ...mapState({
        role: state => state.authentication.role,
      }),
      vrpListItems () {
        return [
          {
            model: this.vesselVrp.name,
            icon: 'mdi-ferry',
            label: 'Vessel Name',
          },
          {
            model: this.vesselVrp.type,
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
            model: this.vesselVrp.vrp_status,
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
            model: this.vesselVrp.tanker ? 'YES' : 'NO',
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
            model: this.vesselVrp.wcd,
            icon: 'mdi-barrel',
            label: 'WCD Barrels',
          },
          {
            model: this.vesselVrp.active ? 'YES' : 'NO',
            icon: 'mdi-bell-ring',
            label: 'Active',
          },
          {
            model: this.vesselVrp.resourceProvider ? 'YES' : 'NO',
            icon: 'mdi-semantic-web',
            label: 'Resource Provider',
          },
        ]
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
        this.loading = true
        axios.get(`vessels/VRPexpress/${this.$route.params.id}`)
          .then(res => {
            this.vesselVrp = res.data
          })
          .catch(err => {
            this.showSnackBar({ text: err, color: 'error' })
          })
          .finally(() => {
            this.loading = false
          })
      },
      async importVessel () {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        this.importing = true
        try {
          const response = await axios.post('vessels/' + this.$route.params.id + '/import')
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

<style lang="sass" scoped>
  .input-container
    margin-top: 0
  .input-label
    font-size: 18px
    font-weight: 300
    color: black
  .input-field
    padding: 0
</style>
