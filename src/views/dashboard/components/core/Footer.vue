<template>
  <v-footer
    v-if="!$route.path.includes('/map')"
    id="dashboard-core-footer"
  >
    <v-container fluid>
      <v-row
        align="center"
        no-gutters
      >
        <v-col
          v-for="(link, i) in links"
          :key="i"
          class="text-center mb-sm-0 mb-5"
          cols="auto"
        >
          <a
            :href="link.href"
            class="mr-0 grey--text text--darken-3"
            rel="noopener"
            target="_blank"
            v-text="link.text"
          />
        </v-col>

        <v-spacer class="hidden-sm-and-down" />

        <v-col
          cols="12"
          md="auto"
        >
          <div class="body-1 font-weight-light pt-6 pt-md-0 text-center">
            &copy; 2020, DONJON-SMIT an OPA-90 Alliance
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
  export default {
    name: 'DashboardCoreFooter',

    data: () => ({
      links: [
        {
          href: 'https://www.donjon-smit.com',
          text: 'Donjon-Smit',
        },
        {
          href: 'https://www.donjon-smit.com/about',
          text: 'About Us',
        },
        {
          href: '#',
          text: 'Terms',
        },
      ],
    }),
  }
</script>

<style lang="sass">
  #dashboard-core-footer
    position: sticky
    a
      font-size: .825rem
      font-weight: 500
      text-decoration: none
      text-transform: uppercase
</style>
