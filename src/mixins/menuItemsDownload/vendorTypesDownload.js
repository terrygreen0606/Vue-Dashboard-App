import { mapActions, mapState } from 'vuex'

export const vendorTypesDownload = {
  computed: {
    ...mapState({
      vendorTypes: state => state.menuitems.vendorTypes,
    }),
  },

  mounted () {
    this.vendorTypesDownload()
  },

  methods: {
    ...mapActions({
      getVendorTypes: 'getVendorTypes',
      showSnackBar: 'showSnackBar',
    }),

    vendorTypesDownload () {
      if (this.vendorTypes.length) return

      this.loading++
      this.getVendorTypes()
        .then(() => {})
        .catch(err => {
          this.showSnackBar({
            text: `${err} on Vendor Types download`,
            color: 'error',
          })
        })
        .finally(() => {
          this.loading--
        })
    },
  },
}
