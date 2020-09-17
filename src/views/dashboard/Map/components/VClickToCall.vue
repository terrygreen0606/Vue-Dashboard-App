<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-list-item-content
        style="cursor: pointer"
        v-on="on"
        @click="callPhone"
      >
        <slot />
      </v-list-item-content>
    </template>
    Click To Call
  </v-tooltip>
</template>

<script>
  export default {
    props: {
      number: [Number, String],
    },
    methods: {
      callPhone () {
        const number = parseInt(this.number.toString().replace(/[^0-9]/g, ''), 10)
        window.open(`tel:${number}`)
      },
    },
  }
</script>

<style lang="scss" scoped>
</style>
