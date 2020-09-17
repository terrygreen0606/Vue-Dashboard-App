/**
 * to manage the store.menuitems.companyLabelItems
 * if it has data return
 * else get that data from api and save in the store
 */

import { mapActions, mapState } from 'vuex'

export const companyLabelItemsDownload = {
  data: () => ({
    companyLabelItemsLoading: false,
  }),

  computed: {
    ...mapState({
      companyLabelItems: state => state.menuitems.companyLabelItems,
    }),
  },

  methods: {
    ...mapActions({
      getCompanyLabelItems: 'getCompanyLabelItems',
    }),

    companyLabelItemsDownload () {
      if (this.companyLabelItems.length) return

      this.companyLabelItemsLoading = true
      this.getCompanyLabelItems()
        .then(() => {})
        .catch(err => {
          this.showSnackBar({
            text: `${err} on Company Label Items download`,
            color: 'error',
          })
        })
        .finally(() => {
          this.companyLabelItemsLoading = false
        })
    },
  },
}
