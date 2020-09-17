<template>
  <v-app>
    <pages-core-view />
    <pages-core-footer />
    <base-material-snackbar
      v-model="$store.state.snackbar.show"
      :color="$store.state.snackbar.color"
      bottom
      right
      :type="null"
    >
      {{ $store.state.snackbar.text }}
    </base-material-snackbar>
  </v-app>
</template>

<script>
  export default {
    name: 'PagesIndex',

    components: {
      PagesCoreView: () => import('./components/core/View'),
      PagesCoreFooter: () => import('./components/core/Footer'),
    },

    created () {
      this.$vuetify.theme.dark = true
    },

    beforeDestroy () {
      this.$vuetify.theme.dark = false
    },
  }
</script>
