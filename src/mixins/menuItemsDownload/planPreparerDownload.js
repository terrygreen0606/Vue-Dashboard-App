/**
 * to manage the store.menuitems.companyItems
 * if it has data return
 * else get that data from api and save in the store
 */

import { mapActions, mapState } from 'vuex'

export const planPreparerDownload = {
  computed: {
    ...mapState({
      planPreparers: state => state.menuitems.planPreparers,
    }),
  },

  mounted () {
    this.planPreparerDownload()
  },

  methods: {
    ...mapActions({
      getPlanPreparers: 'getPlanPreparers',
      showSnackBar: 'showSnackBar',
    }),

    planPreparerDownload () {
      if (this.planPreparers.length) return

      this.loading++
      this.getPlanPreparers()
        .then(() => {})
        .catch(err => {
          this.showSnackBar({
            text: `${err} on Plan Preparer download`,
            color: 'error',
          })
        })
        .finally(() => {
          this.loading--
        })
    },
  },
}
