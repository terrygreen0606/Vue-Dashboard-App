<template>
  <v-app-bar
    absolute
    color="transparent"
    flat
    height="85"
  >
    <v-container class="px-0 text-right d-flex align-center">
      <v-toolbar-title
        class="font-weight-light hidden-xs-only"
        v-text="title"
      />

      <v-spacer />

      <template v-for="item in profile.children">
        <v-btn
          v-if="item.downloadLink"
          :key="item.id"
          :to="item.to"
          min-height="48"
          min-width="40"
          text
          :href="item.downloadLink"
          download="sample_form_format"
        >
          <v-icon
            :left="$vuetify.breakpoint.mdAndUp"
            size="20"
            v-text="item.icon"
          />

          <span
            class="hidden-sm-and-down"
            v-text="item.text"
          />
        </v-btn>

        <v-btn
          v-else
          :key="item.id"
          :to="item.to"
          min-height="48"
          min-width="40"
          text
        >
          <v-icon
            :left="$vuetify.breakpoint.mdAndUp"
            size="20"
            v-text="item.icon"
          />

          <span
            class="hidden-sm-and-down"
            v-text="item.text"
          />
        </v-btn>
      </template>
    </v-container>
  </v-app-bar>
</template>

<script>
  export default {
    name: 'PagesCoreAppBar',

    data: () => ({
      titles: {
        '/admin-workflow': 'Donjon-SMIT Portal',
      },
    }),
    computed: {
      title () {
        return this.titles[this.$route.path]
      },
      profile () {
        return {
          children: [
            {
              id: 1,
              icon: 'mdi-view-dashboard',
              text: 'Dashboard',
              to: '/',
            },
            {
              id: 2,
              icon: 'mdi-cloud-download',
              text: 'Bulk Upload Templates',
              downloadLink: require('@/assets/sample_form_format.zip'),
            },
            {
              id: 3,
              icon: 'mdi-shield-account',
              text: 'My Profile',
              to: '/individuals/' + this.$store.state.authentication.user.id + '/general',
            },
            {
              id: 4,
              icon: 'mdi-lock-open-outline',
              text: 'Lock',
              to: '/pages/lock',
            },
          ],
        }
      },
    },
  }
</script>
