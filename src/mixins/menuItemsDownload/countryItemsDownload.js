/**
 * to manage the store.menuitems.countryItems
 * if it has data return
 * else get that data from api and save in the store
 */

import { mapActions, mapState } from 'vuex'

export const countryItemsDownload = {
  computed: {
    ...mapState({
      countryItems: state => state.menuitems.countryItems,
    }),
  },

  mounted () {
    this.countryItemsDownload()
  },

  methods: {
    ...mapActions({
      getCountryItems: 'getCountryItems',
      showSnackBar: 'showSnackBar',
    }),

    countryItemsDownload () {
      if (this.countryItems.length) return

      this.loading++
      this.getCountryItems()
        .then(() => {})
        .catch(err => {
          this.showSnackBar({
            text: `${err} on Country download`,
            color: 'error',
          })
        })
        .finally(() => {
          this.loading--
        })
    },
  },
}
