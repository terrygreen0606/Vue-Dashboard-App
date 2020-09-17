/**
 * to manage the store.menuitems.qiItems
 * if it has data return
 * else get that data from api and save in the store
 */

import { mapActions, mapState } from 'vuex'

export const qiItemsDownload = {
  computed: {
    ...mapState({
      qiItems: state => state.menuitems.qiItems,
    }),
  },

  mounted () {
    this.qiItemsDownload()
  },

  methods: {
    ...mapActions({
      getQiItems: 'getQiItems',
      showSnackBar: 'showSnackBar',
    }),

    qiItemsDownload () {
      if (this.qiItems.length) return

      this.loading++
      this.getQiItems()
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
