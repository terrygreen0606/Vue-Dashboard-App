<template>
  <v-container v-if="company">
    <v-progress-circular
      v-if="loading"
      indeterminate
      class="cop-info-loading"
    />
    <div v-else>
      <a
        v-if="company.has_photo"
        :href="`https://storage.googleapis.com/donjon-smit/pictures/companies/${company.id}/cover_rect.jpg`"
        target="_blank"
      >
        <v-img
          :src="`https://storage.googleapis.com/donjon-smit/pictures/companies/${company.id}/cover_rect.jpg`"
        />
      </a>
      <v-icon
        v-else
        size="96"
        class="cop-alt-photo"
      >
        mdi-office-building
      </v-icon>
      <h1 class="display-2 mt-4 mb-1 text-center">
        <router-link
          :to="`/companies/${id}`"
          target="_blank"
        >
          {{ company.name }}
        </router-link>
      </h1>
      <v-list
        v-if="address"
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
      <div v-show="company.description">
        <v-card flat>
          <v-card-title class="py-1">
            About {{ company.name }}
          </v-card-title>
          <v-divider inset />
          <v-card-text class="py-1">
            {{ company.description }}
          </v-card-text>
        </v-card>
        <v-divider />
      </div>
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
          <v-list-item-content v-if="info.subtitle === 'Address'">
            {{ info.title }}
          </v-list-item-content>
          <v-click-to-call
            v-else-if="info.icon.includes('phone')"
            :number="info.title"
          >
            <v-list-item-title>{{ info.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ info.subtitle }}</v-list-item-subtitle>
          </v-click-to-call>
          <v-list-item-content v-else>
            <v-list-item-title>{{ info.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ info.subtitle }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action-copy :text-to-copy="info.title" />
        </v-list-item>
      </v-list>

      <v-divider />
      <v-btn
        class="display-1"
        block
        text
        :to="`/companies/${company.id}/smff`"
        target="_blank"
      >
        View Capabilities
      </v-btn>
      <v-btn
        class="display-1"
        block
        text
        @click="pocDialogModel = true"
      >
        Company POC
      </v-btn>
    </div>

    <poc-dialog
      v-if="company"
      :id="company.id"
      :name="company.name"
      :poc-data="company.poc"
      :show="pocDialogModel"
      @close:dialog="closePocDialog"
    />
  </v-container>
</template>

<script>
  import axios from 'axios'
  import { mapActions } from 'vuex'

  export default {
    components: {
      VListItemActionCopy: () => import('../VListItemActionCopy'),
      PocDialog: () => import('./dialogs/PocDialog'),
      VClickToCall: () => import('../VClickToCall'),
    },
    props: {
      id: Number,
      addressId: Number,
      name: String,
    },
    data () {
      return {
        company: null,
        address: null,
        pocDialogModel: false,
        loading: 0,
      }
    },
    computed: {
      infoList1 () {
        return [
          {
            icon: 'mdi-map-marker',
            title: `Latitude: ${this.address.latitude}°, Longitude: ${this.address.longitude}°`,
            subtitle: 'latlng',
          },
          {
            icon: 'mdi-crop-free',
            title: this.address.zone_name,
            subtitle: 'Zone Name',
          },
        ].concat(this.company.network_codes.map(networkCode => ({
          icon: 'mdi-attachment',
          title: networkCode === 'opa_90' ? 'OPA-90 Network'
            : ['npnc', 'ns'].includes(networkCode) ? 'NASA Network'
              : networkCode,
          subtitle: 'Network',
        })))
      },
      infoList2 () {
        return [
          {
            icon: 'mdi-cellphone-iphone',
            title: this.address.phone,
            subtitle: 'Phone',
          },
          {
            icon: 'mdi-map-marker',
            title: `${this.address.street}, ${this.address.city}, ${this.address.state}, ${this.address.zip}, ${this.address.country}`,
            subtitle: 'Address',
          },
          {
            icon: 'mdi-web',
            title: this.company.website,
            subtitle: 'Company Website',
          },
          {
            icon: 'mdi-email',
            title: this.company.email,
            subtitle: 'Company E-mail',
          },
          {
            icon: 'mdi-phone-classic',
            title: this.company.phone,
            subtitle: 'Company Phone',
          },
        ].filter(item => item.title)
      },
    },
    watch: {
      id () {
        this.getCompanyData()
      },
      addressId () {
        this.getAddressData()
      },
    },
    mounted () {
      this.getCompanyData()
      this.getAddressData()
    },
    methods: {
      ...mapActions({
        showSnackBar: 'showSnackBar',
      }),

      getCompanyData () {
        this.loading++
        axios.get('map/company/' + this.id)
          .then(res => {
            this.company = res.data.data
          })
          .catch(() => {
            this.showSnackBar({ text: `Cannot download Company Data for ${this.name}`, color: 'error' })
          })
          .finally(() => {
            this.loading--
          })
      },

      getAddressData () {
        this.loading++
        axios.get('map/company/address/' + this.addressId)
          .then(res => {
            this.address = res.data.data
          })
          .catch(() => {
            this.showSnackBar({ text: `Cannot download Company Address Data for ${this.name}`, color: 'error' })
          })
          .finally(() => {
            this.loading--
          })
      },

      closePocDialog () {
        this.pocDialogModel = false
      },
    },
  }
</script>

<style lang="sass">
</style>
