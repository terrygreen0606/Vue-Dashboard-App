/**
 * to manage the store.menuitems.zoneItems
 * if it has data return
 * else get that data from api and save in the store
 */

import { mapActions, mapState } from 'vuex'

export const zoneItemsDownload = {
  computed: {
    ...mapState({
      zoneItems: state => state.menuitems.zoneItems,
    }),
  },

  mounted () {
    this.zoneItemsDownload()
  },

  methods: {
    ...mapActions({
      getZoneItems: 'getZoneItems',
      showSnackBar: 'showSnackBar',
    }),

    zoneItemsDownload () {
      if (this.zoneItems.length) return

      this.loading++
      this.getZoneItems()
        .then(() => {})
        .catch(err => {
          this.showSnackBar({
            text: `${err} on Zone download`,
            color: 'error',
          })
        })
        .finally(() => {
          this.loading--
        })
    },
  },
}
