/**
 * to manage the store.menuitems.insurerItems
 * if it has data return
 * else get that data from api and save in the store
 */

import { mapActions, mapState } from 'vuex'

export const insurerItemsDownload = {
  computed: {
    ...mapState({
      insurerItems: state => state.menuitems.insurerItems,
    }),
  },

  mounted () {
    this.insurerItemsDownload()
  },

  methods: {
    ...mapActions({
      getInsurerItems: 'getInsurerItems',
      showSnackBar: 'showSnackBar',
    }),

    insurerItemsDownload () {
      if (this.insurerItems.length) return

      this.loading++
      this.getInsurerItems()
        .then(() => {})
        .catch(err => {
          this.showSnackBar({
            text: `${err} on Insurer download`,
            color: 'error',
          })
        })
        .finally(() => {
          this.loading--
        })
    },
  },
}
