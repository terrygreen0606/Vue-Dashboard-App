/**
 * to manage the store.menuitems.pocItems
 * if it has data return
 * else get that data from api and save in the store
 */

import { mapActions, mapState } from 'vuex'

export const pocItemsDownload = {
  computed: {
    ...mapState({
      pocItems: state => state.menuitems.pocItems,
    }),
  },

  mounted () {
    this.pocItemsDownload()
  },

  methods: {
    ...mapActions({
      getPocItems: 'getPocItems',
      showSnackBar: 'showSnackBar',
    }),

    pocItemsDownload () {
      if (this.pocItems.length) return

      this.loading++
      this.getPocItems()
        .then(() => {})
        .catch(err => {
          this.showSnackBar({
            text: `${err} on Poc download`,
            color: 'error',
          })
        })
        .finally(() => {
          this.loading--
        })
    },
  },
}
