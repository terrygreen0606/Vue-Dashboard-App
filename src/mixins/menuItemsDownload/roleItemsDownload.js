/**
 * to manage the store.menuitems.roleItems
 * if it has data return
 * else get that data from api and save in the store
 */

import { mapActions, mapState } from 'vuex'

export const roleItemsDownload = {
  computed: {
    ...mapState({
      roleItems: state => state.menuitems.roleItems,
    }),
  },

  mounted () {
    this.roleItemsDownload()
  },

  methods: {
    ...mapActions({
      getRoleItems: 'getRoleItems',
      showSnackBar: 'showSnackBar',
    }),

    roleItemsDownload () {
      if (this.roleItems.length) return

      this.loading++
      this.getRoleItems()
        .then(() => {})
        .catch(err => {
          this.showSnackBar({
            text: `${err} on Role download`,
            color: 'error',
          })
        })
        .finally(() => {
          this.loading--
        })
    },
  },
}
