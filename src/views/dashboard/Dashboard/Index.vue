<template>
  <v-container
    fluid
    tag="section"
  >
    <v-row>
      <v-col v-if="loading">
        <v-progress-linear indeterminate />
      </v-col>
      <v-col cols="12">
        <base-material-alert
          v-for="(alert, i) in alerts"
          :key="i"
          color="primary"
          dark
          dismissible
          icon="mdi-bell"
        >
          {{ alert.contents }}
        </base-material-alert>
      </v-col>

      <internal-dashboard v-if="role && checkCUD(role.id)" />

      <external-dashboard v-else />

      <v-col
        cols="12"
        md="6"
      >
        <base-material-card
          icon="mdi-earth"
          title="Approximate Working Hours Map"
        >
          <working-hours-map />
        </base-material-card>
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <base-material-card
          icon="mdi-earth"
          title="World Timezone Map"
        >
          <world-timezone-map />
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
    name: 'DashboardIndex',

    components: {
      InternalDashboard: () => import('./InternalDashboard'),
      ExternalDashboard: () => import('./ExternalDashboard'),
      WorkingHoursMap: () => import('../components/maps/WorkingHoursMap'),
      WorldTimezoneMap: () => import('../components/maps/WorldTimezoneMap'),
    },
    data () {
      return {
        alerts: [],
        loading: false,
        checkCUD,
      }
    },

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
        axios.post('alert/dashboard')
          .then(res => {
            this.alerts = res.data
          }).catch(error => {
            if (error.response && error.response.data) {
              this.showSnackBar({ text: error.response.data.message || error.response.statusText, color: 'error' })
            }
          }).finally(() => (this.loading = false))
      },
    },
  }
</script>
