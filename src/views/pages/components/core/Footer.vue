<template>
  <v-footer
    id="pages-core-footer"
    absolute
    color="transparent"
    dark
  >
    <v-container>
      <v-row
        align="center"
        no-gutters
      >
        <v-col
          v-for="(link, i) in links"
          :key="i"
          class="text-center"
          cols="6"
          md="auto"
        >
          <a
            :href="link.href"
            class="mr-0"
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
          <div
            class="body-1 font-weight-light pt-6 pt-md-0 text-center"
            v-text="'Ⓒ 2020, DONJON-SMIT an OPA-90 Alliance'"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
  export default {
    name: 'PagesCoreFooter',

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
      ],
    }),
  }
</script>

<style lang="sass">
  #pages-core-footer
    a
      color: #FFFFFF
      font-size: .825rem
      font-weight: 500
      text-decoration: none
      text-transform: uppercase
</style>
