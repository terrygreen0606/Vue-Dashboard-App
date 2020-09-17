<template>
  <v-container
    id="reports"
    fluid
    tag="section"
  >
    <v-progress-linear
      v-if="loading"
      indeterminate
    />
    <base-material-tabs
      v-else
      v-model="mainTab"
      background-color="transparent"
      centered
      icons-and-text
      show-arrows
      color="secondary"
    >
      <template v-for="(tab, i) in mainTabs">
        <v-tab
          :key="i"
          :to="tab.to"
        >
          {{ tab.text }}
          <v-icon v-text="tab.icon" />
        </v-tab>
      </template>
    </base-material-tabs>

    <router-view />
  </v-container>
</template>

<script>
  import axios from 'axios'
  import { mapActions } from 'vuex'

  export default {
    data: () => ({
      loading: false,
      mainTab: 0,
      mainTabs: [],
    }),

    mounted () {
      this.getReportTypes()
    },

    methods: {
      ...mapActions({
        showSnackBar: 'showSnackBar',
      }),

      async getReportTypes () {
        this.loading = true
        const additions = {
          1: { icon: 'mdi-update', to: 'db-changes' },
          2: { icon: 'mdi-ferry', to: 'active-vessels' },
          3: { icon: 'mdi-domain', to: 'no-contract-companies' },
        }
        try {
          const response = await axios.get('reports/reporttype')
          const reportTypes = response.data.map(type => ({ text: type.name, icon: additions[type.id].icon, to: additions[type.id].to }))
          reportTypes.push({ text: 'Schedule', icon: 'mdi-notebook', to: 'schedule' })
          this.mainTabs = reportTypes
        } catch (err) {
          this.showSnackBar({ text: err, color: 'error' })
        }
        this.loading = false
      },
    },
  }
</script>
