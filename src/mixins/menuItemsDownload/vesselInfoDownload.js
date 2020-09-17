/**
 * to manage the store.menuitems.vesselInfo
 * if it has data return
 * else get that data from api and save in the store
 */

import { mapActions, mapState } from 'vuex'

export const vesselInfoDownload = {
  data: () => ({
    vesselInfoLoading: false,
  }),

  computed: {
    ...mapState({
      vesselInfo: state => state.menuitems.vesselInfo,
    }),
  },

  methods: {
    ...mapActions({
      getVesselInfo: 'getVesselInfo',
    }),

    vesselInfoDownload () {
      if (this.vesselInfo.length) return

      this.vesselInfoLoading = true
      this.getVesselInfo()
        .then(() => {})
        .catch(err => {
          this.showSnackBar({
            text: `${err} on Vessel Information download`,
            color: 'error',
          })
        })
        .finally(() => {
          this.vesselInfoLoading = false
        })
    },
  },
}
