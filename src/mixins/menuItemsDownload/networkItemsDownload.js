/**
 * to manage the store.menuitems.networkItems
 * if it has data return
 * else get that data from api and save in the store
 */

import { mapActions, mapState } from 'vuex'

export const networkItemsDownload = {
  computed: {
    ...mapState({
      networkItems: state => state.menuitems.networkItems,
    }),
  },

  mounted () {
    this.networkItemsDownload()
  },

  methods: {
    ...mapActions({
      getNetworkItems: 'getNetworkItems',
      showSnackBar: 'showSnackBar',
    }),

    networkItemsDownload () {
      if (this.networkItems.length) return

      this.loading++
      this.getNetworkItems()
        .then(() => {})
        .catch(err => {
          this.showSnackBar({
            text: `${err} on Network download`,
            color: 'error',
          })
        })
        .finally(() => {
          this.loading--
        })
    },
  },
}
