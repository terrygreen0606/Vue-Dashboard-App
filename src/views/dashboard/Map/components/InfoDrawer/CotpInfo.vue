<template>
  <v-container>
    <v-img
      width="160"
      class="mx-auto"
      :src="`https://homeport.uscg.mil/${properties.Photo}`"
    />
    <p class="headline mt-4 text-center">
      {{ properties.ZoneName }}
    </p>
    <div class="a-wrapper">
      <a
        v-if="link"
        :href="link"
        target="_blank"
      >
        <span class="display-1">
          Geographic Annex
        </span>
      </a>
    </div>
    <v-list dense>
      <v-list-item
        v-for="info in infoList"
        :key="info.subtitle"
        class="px-0"
      >
        <v-list-item-avatar>
          <v-icon color="primary">
            {{ info.icon }}
          </v-icon>
        </v-list-item-avatar>
        <v-list-item-content v-if="info.subtitle === 'Address'">
          {{ info.title }}
        </v-list-item-content>
        <v-list-item-content v-else>
          <v-list-item-title>{{ info.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ info.subtitle }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action-copy :text-to-copy="info.title" />
      </v-list-item>
    </v-list>
    <v-divider />
  </v-container>
</template>

<script>
  export default {
    components: {
      VListItemActionCopy: () => import('../VListItemActionCopy'),
    },
    props: {
      id: Number,
      features: Array,
    },
    data: () => ({
      area: {
        1: ['Boston', 'Northern New England', 'Southeastern New England', 'New York', 'Long Island Sound'],
        5: ['Delaware Bay', 'Hampton Roads', 'Maryland-National Capital Region', 'North Carolina'],
        7: ['Miami', 'Charleston', 'Jacksonville', 'San Juan', 'St. Petersburg', 'Key West'],
        8: ['Mobile', 'New Orleans', 'Houston-Galveston', 'Corpus Christi', 'Upper Mississippi River', 'Lower Mississippi River', 'Ohio Valley'],
        9: ['Buffalo', 'Lake Michigan', 'Detroit', 'Sault Ste. Marie'],
        11: ['Los Angeles-Long Beach', 'San Diego', 'San Francisco'],
        13: ['Puget Sound', 'Columbia River'],
        14: ['Honolulu', 'Guam'],
        17: ['Juneau', 'Anchorage'],
      },
      links: {
        1: ['./gsa/Boston.pdf', './gsa/N NE.pdf', './gsa/SE NE.pdf', './gsa/NY.pdf', './gsa/LI Snd.pdf'],
        5: ['./gsa/Del Bay.pdf', './gsa/Hmp Rd.pdf', './gsa/Balt.pdf', './gsa/NC.pdf'],
        7: ['./gsa/Mia.pdf', './gsa/Chltn.pdf', './gsa/Jack.pdf', './gsa/O-SJ.pdf', './gsa/St Pte.pdf', './gsa/Ky W.pdf'],
        8: ['./gsa/Mob.pdf', './gsa/NO.pdf', './gsa/Hous.pdf', './gsa/Co Ch.pdf', './gsa/U Miss.pdf', './gsa/L Miss.pdf', './gsa/Ohio V.pdf'],
        9: ['./gsa/Buf.pdf', './gsa/L Mich.pdf', './gsa/Det.pdf', './gsa/SSM.pdf'],
        11: ['./gsa/LALB.pdf', './gsa/SD.pdf', './gsa/SF.pdf'],
        13: ['./gsa/Pg Sd.pdf', './gsa/Prtlnd.pdf'],
        14: ['./gsa/O-Haw.pdf', './gsa/O-Guam.pdf'],
        17: ['./gsa/O-Jun.pdf', './gsa/O-W AK.pdf'],
      },
      specialLinks: {
        'Western Alaska': 'Anchorage',
        'Southeast Alaska': 'Juneau',
        'Lower Mississippi': 'Lower Mississippi River',
        'Morgan City': 'New Orleans',
        'MSU Savannah': 'Charleston',
        'Port Arthur': 'Houston-Galveston',
        'MSU Pittsburgh': 'Ohio Valley',
        'Prince William Sound': 'Anchorage',
        Baltimore: 'Maryland-National Capital Region',
        Duluth: 'Sault Ste. Marie',
      },
    }),
    computed: {
      properties () {
        return this.features[this.id].properties
      },
      infoList () {
        return [
          {
            icon: 'mdi-office-building',
            title: this.properties.Office,
            subtitle: 'Office',
          },
          {
            icon: 'mdi-map-marker',
            title: this.properties.Address,
            subtitle: 'Address',
          },
          {
            icon: 'mdi-police-badge',
            title: this.properties.Enforcement,
            subtitle: 'Enforcement',
          },
          {
            icon: 'mdi-cellphone-iphone',
            title: this.properties.Primary,
            subtitle: 'Primary',
          },
          {
            icon: 'mdi-phone',
            title: this.properties.Response,
            subtitle: 'Response',
          },
          {
            icon: 'mdi-phone-classic',
            title: this.properties.Prevention,
            subtitle: 'Prevention',
          },
        ].filter(item => item.title)
      },
      link () {
        let zoneName = this.features[this.id].properties.ZoneName
        if (zoneName in this.specialLinks) {
          zoneName = this.specialLinks[zoneName]
        }
        try {
          const key = Object.keys(this.area).find(key => this.area[key].includes(zoneName))
          const i = this.area[key].indexOf(zoneName)
          return this.links[key][i]
        } catch (err) {
          return null
        }
      },
    },
  }
</script>

<style lang="sass" scoped>
  .a-wrapper
    display: flex
    justify-content: center
    a
      text-decoration: none
      &:hover
        color: hotpink
</style>
