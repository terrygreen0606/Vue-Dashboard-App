<template>
  <v-container>
    <v-progress-circular
      v-if="loading"
      indeterminate
      class="cop-info-loading"
    />
    <div v-else-if="listItems">
      <div
        v-for="item in listItems"
        :key="item.header"
      >
        <h1 class="display-2 mt-4 mb-1 text-center">
          {{ item.header }}
        </h1>
        <p class="display-1 mb-1 text-center">
          {{ item.content }}
        </p>
      </div>
      <v-btn
        class="display-1 mt-5"
        block
        text
        @click="pierDialogModel = true"
      >
        See Details
      </v-btn>
    </div>
    <pier-details-dialog
      :show="pierDialogModel"
      :pier-details="pierDetails"
      @close:dialog="() => { pierDialogModel = false }"
    />
  </v-container>
</template>

<script>
  import axios from 'axios'
  import { mapActions } from 'vuex'

  export default {
    components: {
      PierDetailsDialog: () => import('./dialogs/PierDetailsDialog'),
    },
    props: {
      id: [String, Number],
    },
    data: () => ({
      loading: false,
      pierDialogModel: false,
      pierDetails: null,
    }),
    computed: {
      listItems () {
        return [
          {
            header: 'LOCATION_D',
            content: this.pierDetails.LOCATION_D ? this.pierDetails.LOCATION_D : 'Unknown',
          },
          {
            header: 'COMMODITIE',
            content: this.pierDetails.COMMODITIE ? this.pierDetails.COMMODITIE : 'Unknown',
          },
        ]
      },
    },
    watch: {
      id: function (val) {
        this.getPierDetailsFromApi()
      },
    },
    mounted () {
      this.getPierDetailsFromApi()
    },
    methods: {
      ...mapActions({
        showSnackBar: 'showSnackBar',
      }),
      getPierDetailsFromApi () {
        this.loading = true
        axios.get(`/map/piers/${this.id}`)
          .then(res => {
            this.pierDetails = res.data
          })
          .catch(err => {
            this.showSnackBar({ text: err, color: 'error' })
            this.pierDetails = {
              FID: '4001',
              ID: '16623',
              NAV_UNIT_I: '0TH7',
              UNLOCODE: 'SEA',
              NAV_UNIT_N: 'Port of Seattle, Shilshole Bay Marina, Piers J and W, Fishing-Vessel Moorings.',
              LOCATION_D: 'Puget Sound, Seattle, at east side of Shilshole Bay north of entrance to Salmon Bay (Pier J), approximately 0.4 mile north of south entrance to Shilshole Bay Marina.',
              FACILITY_T: 'Dock',
              STREET_ADD: '7001 Seaview Avenue N.W.',
              CITY_OR_TO: 'Seattle',
              STATE_POST: 'WA',
              ZIPCODE: '98117',
              COUNTY_NAM: 'King',
              COUNTY_FIP: '33',
              CONGRESS: '112',
              CONGRESS_F: '7',
              WTWY_NAME: 'SEATTLE HARBOR, WA',
              PORT_NAME: 'Seattle, WA',
              MILE: '0',
              BANK: 'East',
              LATITUDE1: '47.681111',
              LONGITUDE1: '-122.40611',
              OPERATORS: '',
              OWNERS: 'Current Owner and Operator: Port of Seattle. Phone: 206-728-3388 FAX: 206-728-3391',
              PURPOSE: 'Transient mooring of fishing vessels and recreational craft.',
              HIGHWAY_NO: 'Via marina roads, asphalt, various widths; from Seaview Avenue N.W., dual lane, each asphalt, 32 feet wide; and N.W. 54th Street, asphalt, 28-38 feet wide.',
              RAILWAY_NO: 'None.',
              LOCATION: '91214',
              DOCK: '30',
              COMMODITIE: '',
              CONSTRUCTI: 'Two piers extending from concrete bulkhead with concrete-/asphalt-surfaced solid fill, with 5- to 10-foot-wide concrete floats.  Pier "J", a T-head pier, with finger piers extending from south and north sides to form twelve and fourteen slips, respective',
              MECHANICAL: 'None.',
              REMARKS: 'Additional berthing space of 150 feet, in water depths of 7 feet, is available at a 10-foot-wide concrete float extending from south side of Pier "J" to floats along the north side of Central Pier (Ref. No. 190).\r\nPier "W", approximately 0.4 mile north o',
              VERTICAL_D: 'MLLW (Mean Lower Low Water)',
              DEPTH_MIN: '15',
              DEPTH_MAX: '15',
              BERTHING_L: '125',
              BERTHING_T: '2605',
              DECK_HEIGH: '0',
              DECK_HEIG1: '0',
              SERVICE_IN: '01-JAN-1990',
              SERVICE_TE: '',
            }
          })
          .finally(() => {
            this.loading = false
          })
      },
    },
  }
</script>

<style lang="sass" scoped>
</style>
