<template>
  <v-navigation-drawer
    v-model="options.show"
    absolute
    floating
    :temporary="options.temporary"
    width="300"
    style="z-index: 5"
  >
    <vessel-info
      v-if="options.type === 'vessel'"
      :options.sync="options"
      @draw:updated-vessel-on-map="drawUpdatedVesselOnMap"
      @get-and-render-vessel-track="$emit('get-and-render-vessel-track', options.id)"
    />
    <company-info
      v-if="options.type === 'company'"
      :id="options.id"
      :address-id="options.addressId"
      :name="options.name"
    />
    <individual-info
      v-if="options.type === 'individual'"
      :id="options.id"
      :address-id="options.addressId"
      :name="options.name"
    />
    <cotp-info
      v-if="options.type === 'cotp'"
      :id="options.id"
      :features="features"
    />
    <pier-info
      v-if="options.type === 'pier'"
      :id="options.id"
    />
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          block
          text
          v-on="on"
          @click="options.show = false"
        >
          Close
        </v-btn>
      </template>
      Close the sidebar
    </v-tooltip>
  </v-navigation-drawer>
</template>

<script>
  export default {
    components: {
      VesselInfo: () => import('./VesselInfo'),
      CompanyInfo: () => import('./CompanyInfo'),
      IndividualInfo: () => import('./IndividualInfo'),
      CotpInfo: () => import('./CotpInfo'),
      PierInfo: () => import('./PierInfo'),
    },
    props: {
      options: Object,
      features: {
        type: Array,
        default: null,
      },
    },
    methods: {
      drawUpdatedVesselOnMap (vessel) {
        this.$emit('draw:updated-vessel-on-map', vessel)
      },
    },
  }
</script>

<style lang="options.scss" scoped></style>
