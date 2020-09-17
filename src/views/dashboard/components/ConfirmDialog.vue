<template>
  <v-dialog
    v-model="dialogModel"
    max-width="500"
  >
    <v-card>
      <v-card-title
        class="headline title-color"
      >
        {{ title }}
      </v-card-title>
      <v-card-text>
        {{ text }}
      </v-card-text>
      <v-card-actions>
        <div class="button-container">
          <v-btn
            color="success"
            class="ma-1"
            elevation="1"
            @click="closeDialog"
          >
            <v-icon
              class="v-alert__icon"
            >
              mdi-check
            </v-icon>
            {{ closeText }}
          </v-btn>
          <v-btn
            color="warning"
            class="ma-1"
            elevation="1"
            @click="$emit('discard:changes')"
          >
            <v-icon
              class="v-alert__icon"
            >
              mdi-alert
            </v-icon>
            {{ discardText }}
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import { dialog } from '@/mixins/dialog'

  export default {
    mixins: [dialog],

    props: {
      title: {
        type: String,
        default: 'Confirm Navigation',
      },
      text: {
        type: String,
        default: 'Do you want to discard changes?',
      },
      closeText: {
        type: String,
        default: 'NO, STAY ON SECTION',
      },
      discardText: {
        type: String,
        default: 'DISCARD CHANGES',
      },
    },
  }
</script>

<style lang="sass" scoped>
  .button-container
    width: 100%
    display: flex
    justify-content: space-evenly
    flex-wrap: wrap
</style>
