<template>
  <v-container>
    <v-progress-circular
      v-if="loading"
      indeterminate
      class="cop-info-loading"
    />
    <div v-else>
      <v-alert
        v-if="smff"
        block
        class="py-0"
      >
        <p class="display-1 mb-1">
          List of SMFF Capabilities
        </p>
        <ul>
          <li
            v-for="service in servicesWithSmff"
            :key="service.id"
          >
            {{ service.name }}
          </li>
        </ul>
      </v-alert>

      <v-alert
        v-else
        class="py-0"
        type="info"
        color="red"
      >
        No SMFF Capabilities Listed
      </v-alert>
      <v-btn
        block
        color="indigo"
        dark
        :to="`/${type}/${typeId}/smff`"
        target="_blank"
      >
        Edit SMFF Capabilities
      </v-btn>
    </div>
  </v-container>
</template>

<script>
  import axios from 'axios'
  import { mapActions } from 'vuex'
  import { itemsServices } from '../../../helpers'

  export default {
    props: {
      id: Number,
      type: String,
      typeId: Number,
    },
    data () {
      return {
        loading: false,
        smff: null,
        itemsServices,
      }
    },
    computed: {
      servicesWithSmff () {
        return this.itemsServices.filter(service => this.smff[service.id])
      },
    },
    watch: {
      id () {
        this.getData()
      },
    },
    mounted () {
      this.getData()
    },
    methods: {
      ...mapActions({
        showSnackBar: 'showSnackBar',
      }),
      getData () {
        this.loading = true
        axios.get('map/smff/' + this.id)
          .then(res => {
            this.smff = res.data
            this.loading = false
          })
          .catch((err) => {
            this.loading = false
            this.showSnackBar({ text: `${err} on SMFF info download`, color: 'error' })
          })
      },
    },
  }
</script>

<style scoped></style>
