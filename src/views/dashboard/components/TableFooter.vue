<template>
  <v-row
    align="baseline"
    justify="end"
  >
    <v-col
      cols="10"
      sm="4"
    >
      <v-select
        v-model="options.itemsPerPage"
        :items="pageItems"
        label="Items per page"
      />
    </v-col>
    <v-col cols="auto">
      <v-pagination
        v-model="options.page"
        :length="totalPages"
        :total-visible="5"
        circle
      />
    </v-col>
    <v-col cols="auto">
      <span>Total {{ total }} items</span>
    </v-col>
  </v-row>
</template>

<script>

  export default {
    name: 'TableFooter',
    props: {
      options: {
        type: Object,
        default: () => {},
      },
      total: {
        type: Number,
        default: 0,
      },
      company: {
        type: Boolean,
        default: false,
      },
    },
    data: () => ({
      items: [
        { text: 5, value: 5 },
        { text: 10, value: 10 },
        { text: 20, value: 20 },
        { text: 50, value: 50 },
        { text: 100, value: 100 },
        { text: 'All', value: -1 },
      ],
    }),
    computed: {
      pageItems () {
        if (this.company) {
          return this.items.filter(item => item.value !== 100)
        } else {
          return this.items.filter(item => item.value > 0)
        }
      },
      totalPages () {
        return this.options.itemsPerPage > 0 ? Math.ceil(this.total / this.options.itemsPerPage) : this.total
      },
    },
  }
</script>
