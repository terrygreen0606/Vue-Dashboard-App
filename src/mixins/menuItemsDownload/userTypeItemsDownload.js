/**
 * to manage the store.menuitems.userTypeItems
 * if it has data return
 * else get that data from api and save in the store
 */

import { mapActions, mapState } from 'vuex'

export const userTypeItemsDownload = {
  computed: {
    ...mapState({
      userTypeItems: state => state.menuitems.userTypeItems,
    }),
  },

  mounted () {
    this.userTypeItemsDownload()
  },

  methods: {
    ...mapActions({
      getUserTypeItems: 'getUserTypeItems',
      showSnackBar: 'showSnackBar',
    }),

    userTypeItemsDownload () {
      if (this.userTypeItems.length) return

      this.loading++
      this.getUserTypeItems()
        .then(() => {})
        .catch(err => {
          this.showSnackBar({
            text: `${err} on UserType download`,
            color: 'error',
          })
        })
        .finally(() => {
          this.loading--
        })
    },
  },
}
