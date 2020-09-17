<template>
  <v-snackbar
    :class="classes"
    :value="value"
    v-bind="{
      ...$attrs,
      ...$props,
      'color': 'transparent'
    }"
    @change="$emit('change', $event)"
  >
    <base-material-alert
      :color="color"
      :dismissible="dismissible"
      :type="type"
      class="ma-0"
      dark
    >
      <slot />
    </base-material-alert>
  </v-snackbar>
</template>
<script>
  // Components
  import { VSnackbar } from 'vuetify/lib'

  export default {
    name: 'BaseMaterialSnackbar',

    extends: VSnackbar,

    props: {
      dismissible: {
        type: Boolean,
        default: true,
      },
      type: {
        type: String,
        default: '',
      },
    },

    computed: {
      classes () {
        return {
          ...VSnackbar.options.computed.classes.call(this),
          'v-snackbar--material': true,
        }
      },
    },
  }
</script>

<style lang="sass">
  .v-snackbar--material
    .v-alert--material,
    .v-snack__wrapper
      border-radius: 4px
      margin: 0

    .v-snack__content
      overflow: visible
      padding: 0
      .v-alert                  // modified: snackbar width not filling
        width: 100% !important
</style>
