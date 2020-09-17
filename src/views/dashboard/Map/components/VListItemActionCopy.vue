<template>
  <v-list-item-action class="my-0">
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          v-on="on"
          @click="$copyText(textToCopy)"
        >
          <v-icon>
            mdi-content-copy
          </v-icon>
        </v-btn>
      </template>
      Click to copy
    </v-tooltip>
  </v-list-item-action>
</template>

<script>
  export default {
    props: {
      textToCopy: [String, Number],
    },
  }
</script>

<style lang="scss" scoped></style>
