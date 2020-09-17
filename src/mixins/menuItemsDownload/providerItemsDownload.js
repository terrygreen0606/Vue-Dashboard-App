/**
 * to manage the store.menuitems.providerItems
 * if it has data return
 * else get that data from api and save in the store
 */

import { mapActions, mapState } from 'vuex'

export const providerItemsDownload = {
  computed: {
    ...mapState({
      providerItems: state => state.menuitems.providerItems,
    }),
  },

  mounted () {
    this.providerItemsDownload()
  },

  methods: {
    ...mapActions({
      getProviderItems: 'getProviderItems',
      showSnackBar: 'showSnackBar',
    }),

    providerItemsDownload () {
      if (this.providerItems.length) return

      this.loading++
      this.getProviderItems()
        .then(() => {})
        .catch(err => {
          this.showSnackBar({
            text: `${err} on Provider download`,
            color: 'error',
          })
        })
        .finally(() => {
          this.loading--
        })
    },
  },
}
