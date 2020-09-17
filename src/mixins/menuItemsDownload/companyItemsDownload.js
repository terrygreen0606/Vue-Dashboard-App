/**
 * to manage the store.menuitems.companyItems
 * if it has data return
 * else get that data from api and save in the store
 */

import { mapActions, mapState } from 'vuex'

export const companyItemsDownload = {
  data: () => ({
    loading: 0,
  }),

  computed: {
    ...mapState({
      companyItems: state => state.menuitems.companyItems,
    }),
  },

  mounted () {
    this.companyItemsDownload()
  },

  methods: {
    ...mapActions({
      getCompanyItems: 'getCompanyItems',
      showSnackBar: 'showSnackBar',
    }),

    companyItemsDownload () {
      // if (this.companyItems.length) return

      this.loading++
      this.getCompanyItems()
        .then(() => {})
        .catch(err => {
          this.showSnackBar({
            text: `${err} on Company download`,
            color: 'error',
          })
        })
        .finally(() => {
          this.loading--
        })
    },
  },
}
