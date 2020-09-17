<template>
  <v-dialog
    v-model="dialogModel"
    max-width="500px"
  >
    <v-card>
      <v-card-title>
        <p class="display-2">
          Details
        </p>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="pierDetailsArray"
          :items-per-page="10"
          class="elevation-1"
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
    mixins: [dialog],
    props: {
      pierDetails: {
        type: Object,
        default: function () {
          return {}
        },
      },
    },
    data: () => ({
      headers: [
        {
          text: 'Classification',
          align: 'start',
          value: 'key',
        },
        {
          text: 'Content',
          value: 'value',
        },
      ],
    }),
    computed: {
      pierDetailsArray () {
        return Object.entries(this.pierDetails).map(([key, value]) => ({ key, value }))
      },
    },
  }
</script>

<style lang="sass" scoped>
</style>
