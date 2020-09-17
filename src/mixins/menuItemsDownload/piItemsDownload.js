/**
 * to manage the store.menuitems.piItems
 * if it has data return
 * else get that data from api and save in the store
 */

import { mapActions, mapState } from 'vuex'

export const piItemsDownload = {
  computed: {
    ...mapState({
      piItems: state => state.menuitems.piItems,
    }),
  },

  mounted () {
    this.piItemsDownload()
  },

  methods: {
    ...mapActions({
      getPiItems: 'getPiItems',
      showSnackBar: 'showSnackBar',
    }),

    piItemsDownload () {
      if (this.piItems.length) return

      this.loading++
      this.getPiItems()
        .then(() => {})
        .catch(err => {
          this.showSnackBar({
            text: `${err} on Pi download`,
            color: 'error',
          })
        })
        .finally(() => {
          this.loading--
        })
    },
  },
}
