<template>
  <v-container v-if="vessel">
    <v-progress-circular
      v-if="loading"
      indeterminate
      class="cop-info-loading"
    />
    <div v-else>
      <a
        v-if="vessel.has_photo"
        :href="`https://storage.googleapis.com/donjon-smit/pictures/vessels/${vessel.id}/cover_rect.jpg`"
        target="_blank"
      >
        <v-img
          :src="`https://storage.googleapis.com/donjon-smit/pictures/vessels/${vessel.id}/cover_rect.jpg`"
        />
      </a>
      <a
        v-else-if="vessel.company.has_photo"
        :href="`https://storage.googleapis.com/donjon-smit/pictures/companies/${vessel.company.id}/cover_rect.jpg`"
        target="_blank"
      >
        <v-img
          :src="`https://storage.googleapis.com/donjon-smit/pictures/companies/${vessel.company.id}/cover_rect.jpg`"
        />
      </a>
      <v-icon
        v-else
        size="96"
        class="cop-alt-photo"
      >
        mdi-ferry
      </v-icon>
      <h1 class="display-2 mt-4 mb-1 text-center">
        <router-link
          :to="`/vessels/${vessel.id}`"
          target="_blank"
        >
          {{ vessel.name }}
        </router-link>
      </h1>
      <p class="display-1 mb-1 text-center">
        {{ vessel.type }}
      </p>
      <p class="display-1 mb-1 text-center">
        <router-link
          :to="`/companies/${vessel.company.id}`"
          target="_blank"
        >
          {{ vessel.company.name }}
        </router-link>
      </p>
      <v-list
        v-if="vessel"
        dense
      >
        <v-list-item
          v-for="info in infoList1"
          :key="info.content"
          class="px-0"
        >
          <v-list-item-avatar class="my-0">
            <v-icon color="primary">
              {{ info.icon }}
            </v-icon>
          </v-list-item-avatar>
          <v-list-item-content v-if="info.subtitle === 'latlng'">
            <v-list-item-title
              v-for="title in info.title.split(', ')"
              :key="title"
            >
              {{ title }}
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-content v-else>
            {{ info.title }}
          </v-list-item-content>
          <v-list-item-action-copy :text-to-copy="info.title" />
        </v-list-item>
      </v-list>

      <v-divider />
      <v-list dense>
        <v-list-item
          v-for="info in infoList2"
          :key="info.subtitle"
          class="px-0"
        >
          <v-list-item-avatar class="my-0">
            <v-icon color="primary">
              {{ info.icon }}
            </v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ info.title }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ info.subtitle }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action-copy :text-to-copy="info.title" />
        </v-list-item>
      </v-list>

      <v-divider />
      <v-btn
        class="display-1"
        block
        text
        :to="`/vessels/${vessel.id}/smff`"
        target="_blank"
      >
        View Capabilities
      </v-btn>
      <v-btn
        class="display-1"
        block
        text
        @click="fetchDialogModel = true; options.temporary = false"
      >
        Fetch AIS Data
      </v-btn>
      <v-btn
        :disabled="vessel.count_tracks <= 1"
        class="display-1"
        block
        text
        @click="$emit('get-and-render-vessel-track', vessel.id)"
      >
        Show Historic Track ({{ vessel.count_tracks }})
      </v-btn>
    </div>

    <fetch-dialog
      :id="vessel.id"
      :show="fetchDialogModel"
      @get:data-from-api="getVesselData"
      @close:dialog="() => { fetchDialogModel = false; options.temporary = true }"
    />
  </v-container>
</template>

<script>
  import axios from 'axios'
  import { mapActions } from 'vuex'

  export default {
    components: {
      FetchDialog: () => import('./dialogs/FetchDialog'),
      VListItemActionCopy: () => import('../VListItemActionCopy'),
    },
    props: {
      options: Object,
    },
    data () {
      return {
        vessel: null,
        loading: false,
        fetchDialogModel: false,
      }
    },
    computed: {
      infoList1 () {
        return [
          {
            icon: 'mdi-map-marker',
            title: `Latitude: ${this.vessel.latitude || ''}°, Longitude: ${this.vessel.longitude || ''}°`,
            subtitle: 'latlng',
          },
          {
            icon: 'mdi-crop-free',
            title: this.vessel.zone,
            subtitle: 'Zone Name',
          },
        ].concat(this.vessel.networks.map(network => ({
          icon: 'mdi-attachment',
          title: network.name,
          subtitle: 'Network',
        })))
      },
      infoList2 () {
        return [
          {
            icon: 'mdi-fingerprint',
            title: this.vessel.imo,
            subtitle: 'IMO Number',
          },
          {
            icon: 'mdi-antenna',
            title: this.vessel.mmsi,
            subtitle: 'MMSI Number',
          },
          {
            icon: 'mdi-arrow-right',
            title: this.vessel.destination,
            subtitle: 'Destination',
          },
          {
            icon: 'mdi-clock',
            title: this.vessel.eta,
            subtitle: 'ETA',
          },
          {
            icon: 'mdi-history',
            title: this.vessel.timestamp,
            subtitle: 'Position received',
          },
          {
            icon: 'mdi-speedometer',
            title: this.vessel.speed && `${this.vessel.speed} kt`,
            subtitle: 'Speed',
          },
          {
            icon: 'mdi-compass',
            title: this.vessel.heading && `${this.vessel.heading}°`,
            subtitle: 'Heading',
          },
          {
            icon: 'mdi-chart-line-variant',
            title: this.vessel.course && `${this.vessel.course}°`,
            subtitle: 'Course',
          },
          {
            icon: 'mdi-weight',
            title: this.vessel.tonnage && `${this.vessel.tonnage} GT`,
            subtitle: 'Tonnage',
          },
        ]
      },
    },
    watch: {
      'options.id' () {
        this.getVesselData()
      },
    },
    mounted () {
      this.getVesselData()
    },
    methods: {
      ...mapActions({
        showSnackBar: 'showSnackBar',
      }),

      /**
       * if called from FetchDialog(drawOnMap = true), so we have a newly updated information,
       * need to draw it on the map
       */
      getVesselData (drawOnMap = false) {
        this.loading = true
        axios.get('map/vessel/' + this.options.id)
          .then(res => {
            this.vessel = res.data.data
            if (drawOnMap) {
              this.$emit('draw:updated-vessel-on-map', this.vessel)
            }
          })
          .catch(() => {
            this.showSnackBar({ text: `Cannot download Vessel Data for ${this.options.id}`, color: 'error' })
          })
          .finally(() => {
            this.loading = false
          })
      },
    },
  }
</script>

<style lang="sass">
</style>
