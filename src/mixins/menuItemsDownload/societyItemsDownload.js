/**
 * to manage the store.menuitems.societyItems
 * if it has data return
 * else get that data from api and save in the store
 */

import { mapActions, mapState } from 'vuex'

export const societyItemsDownload = {
  computed: {
    ...mapState({
      societyItems: state => state.menuitems.societyItems,
    }),
  },

  mounted () {
    this.societyItemsDownload()
  },

  methods: {
    ...mapActions({
      getSocietyItems: 'getSocietyItems',
      showSnackBar: 'showSnackBar',
    }),

    societyItemsDownload () {
      if (this.societyItems.length) return

      this.loading++
      this.getSocietyItems()
        .then(() => {})
        .catch(err => {
          this.showSnackBar({
            text: `${err} on Society download`,
            color: 'error',
          })
        })
        .finally(() => {
          this.loading--
        })
    },
  },
}
