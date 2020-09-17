<template>
  <v-dialog
    v-model="dialogModel"
    max-width="350px"
  >
    <v-card>
      <v-card-title>
        <p class="display-2 ma-1">
          {{ name }}
        </p>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <poc
          :poc="pocData"
          :company-id="id"
          type="companies"
        />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          small
          class="display-1"
          @click="closeDialog"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import { dialog } from '../../../mixins/dialog'
  export default {
    components: {
      Poc: () => import('./Poc'),
    },
    mixins: [dialog],
    props: {
      id: Number,
      name: String,
      pocData: Object,
      show: Boolean,
    },
  }
</script>

<style lang="scss" scoped>
</style>
