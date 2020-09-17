/**
 * to manage the store.menuitems.fleetItems
 * if it has data return
 * else get that data from api and save in the store
 */

import { mapActions, mapState } from 'vuex'

export const fleetItemsDownload = {
  computed: {
    ...mapState({
      fleetItems: state => state.menuitems.fleetItems,
    }),
  },

  mounted () {
    this.fleetItemsDownload()
  },

  methods: {
    ...mapActions({
      getFleetItems: 'getFleetItems',
      showSnackBar: 'showSnackBar',
    }),

    fleetItemsDownload () {
      if (this.fleetItems.length) return

      this.loading++
      this.getFleetItems()
        .then(() => {})
        .catch(err => {
          this.showSnackBar({
            text: `${err} on Fleet download`,
            color: 'error',
          })
        })
        .finally(() => {
          this.loading--
        })
    },
  },
}
