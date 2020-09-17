<template>
  <v-autocomplete
    v-model="searchModel"
    :items="searchedItems"
    :loading="!!loading"
    :search-input.sync="search"
    placeholder="Vessel, Company..."
    item-text="name"
    item-value="info"
    prepend-icon="mdi-magnify"
    hide-details
    hide-no-data
    dense
    class="toolbar-search-autocomplete"
  >
    <template v-slot:item="{ item }">
      <v-list-item-avatar
        size="25"
        color="secondary"
      >
        <v-icon
          color="accent"
          size="16"
        >
          {{ getIcon(item.info.type) }}
        </v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title v-text="item.name" />
        <v-list-item-subtitle v-text="item.description" />
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>

<script>
  import axios from 'axios'
  import { mapActions } from 'vuex'

  export default {
    data () {
      return {
        searchModel: null,
        searchedItems: [],
        loading: 0,
        search: null,
        timeoutId: null,
        call: null, // used to stop previous axios request
      }
    },
    watch: {
      search (value) {
        if (this.timeoutId) clearTimeout(this.timeoutId)
        if (value) {
          this.timeoutId = setTimeout(() => {
            this.getDataFromApi()
          }, 500)
        }
      },
      searchModel (value) {
        this.$emit('handle:searched-item', value)
      },
    },
    methods: {
      ...mapActions({
        showSnackBar: 'showSnackBar',
      }),
      getDataFromApi () {
        // if have preivous call, cancel it
        if (this.call) {
          this.call.cancel()
        }

        this.loading++

        // create a new call
        this.call = axios.CancelToken.source()

        axios.get(`/map/search/${this.search.replace('&', '%26')}`, {
          cancelToken: this.call.token,
        })
          .then(res => { this.searchedItems = res.data })
          .catch((err) => {
            if (!axios.isCancel(err)) {
              this.showSnackBar({
                text: `${err} on search api`,
                color: 'error',
              })
            }
          })
          .finally(() => {
            this.call = null
            this.loading--
          })
      },
      getIcon (type) {
        const icons = {
          vessel: 'mdi-ferry',
          individual: 'mdi-account',
          company: 'mdi-domain',
          location: 'mdi-map-marker',
        }
        return icons[type] ? icons[type] : 'mdi-cancel'
      },
    },
  }
</script>

<style lang="sass" scoped>
  .toolbar-search-autocomplete
    max-width: 200px
</style>
