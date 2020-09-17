/**
 * to manage the store.menuitems.vesselTypeItems
 * if it has data return
 * else get that data from api and save in the store
 */

import { mapActions, mapState } from 'vuex'

export const vesselTypeItemsDownload = {
  computed: {
    ...mapState({
      vesselTypeItems: state => state.menuitems.vesselTypeItems,
    }),
  },

  mounted () {
    this.vesselTypeItemsDownload()
  },

  methods: {
    ...mapActions({
      getVesselTypeItems: 'getVesselTypeItems',
      showSnackBar: 'showSnackBar',
    }),

    vesselTypeItemsDownload () {
      if (this.vesselTypeItems.length) return

      this.loading++
      this.getVesselTypeItems()
        .then(() => {})
        .catch(err => {
          this.showSnackBar({
            text: `${err} on Vessel Type download`,
            color: 'error',
          })
        })
        .finally(() => {
          this.loading--
        })
    },
  },
}
