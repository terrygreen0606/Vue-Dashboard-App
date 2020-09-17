export const dialog = {
  props: {
    show: Boolean,
  },
  computed: {
    dialogModel: {
      get () {
        return this.show
      },
      set (value) {
        if (!value) this.closeDialog()
      },
    },
  },
  methods: {
    closeDialog () {
      this.$emit('close:dialog')
    },
  },
}
