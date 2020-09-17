<template>
  <v-container v-if="user">
    <v-progress-circular
      v-if="loading"
      indeterminate
      class="cop-info-loading"
    />
    <div v-else>
      <a
        v-if="user.has_photo"
        :href="`https://storage.googleapis.com/donjon-smit/pictures/individuals/${user.id}/cover_rect.jpg`"
        target="_blank"
      >
        <v-img
          :src="`https://storage.googleapis.com/donjon-smit/pictures/individuals/${user.id}/cover_rect.jpg`"
        />
      </a>
      <a
        v-else-if="user.primary_company && user.primary_company.has_photo"
        :href="`https://storage.googleapis.com/donjon-smit/pictures/companies/${user.primary_company.id}/cover_rect.jpg`"
        target="_blank"
      >
        <v-img
          :src="`https://storage.googleapis.com/donjon-smit/pictures/companies/${user.primary_company.id}/cover_rect.jpg`"
        />
      </a>
      <v-icon
        v-else
        size="96"
        class="cop-alt-photo"
      >
        mdi-account
      </v-icon>
      <h1 class="display-2 mt-4 mb-1 text-center">
        <router-link
          :to="`/individuals/${id}`"
          target="_blank"
        >
          {{ userName }}
        </router-link>
      </h1>
      <p
        v-if="user.company && user.company.name"
        class="display-1 mb-1 text-center"
      >
        {{ user.company.name }}
      </p>

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

      <div v-show="user.description">
        <v-card flat>
          <v-card-title>
            About {{ userName }}
          </v-card-title>
          <v-divider inset />
          <v-card-text>
            {{ user.description }}
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
        :to="`/individuals/${user.id}/smff`"
        target="_blank"
      >
        View Capabilities
      </v-btn>
      <v-btn
        v-if="user.company"
        class="display-1"
        block
        text
        @click="pocDialogModel = true"
      >
        Company POC
      </v-btn>
    </div>

    <poc-dialog
      v-if="user.company"
      :id="user.company.id"
      :name="user.company.name"
      :poc-data="user.company.company_p_o_c"
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
        user: null,
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
            title: this.address
              ? `Latitude: ${this.address.latitude}°, Longitude: ${this.address.longitude}°`
              : undefined,
            subtitle: 'latlng',
          },
          {
            icon: 'mdi-crop-free',
            title: this.address && this.address.zone_name
              ? this.address.zone_name
              : undefined,
            subtitle: 'Zone Name',
          },
        ].concat(this.user.networks.map(network => ({
          icon: 'mdi-attachment',
          title: network.name,
          subtitle: 'Network',
        })))
      },
      infoList2 () {
        return [
          {
            icon: 'mdi-cellphone-iphone',
            title: this.user && this.user.mobile_number ? this.user.mobile_number : undefined,
            subtitle: 'Phone',
          },
          {
            icon: 'mdi-map-marker',
            title: this.address
              ? `${this.address.street}, ${this.address.city}, ${this.address.state}, ${this.address.zip}, ${this.address.country}`
              : undefined,
            subtitle: 'Address',
          },
          {
            icon: 'mdi-web',
            title: this.user && this.user.resume_link ? this.user.resume_link : undefined,
            subtitle: 'Resume Link',
          },
          {
            icon: 'mdi-email',
            title: this.user && this.user.email ? this.user.email : undefined,
            subtitle: 'E-mail',
          },
        ].filter(item => item.title)
      },
      userName () {
        return `${this.user.first_name} ${this.user.last_name}`
      },
    },
    watch: {
      id () {
        this.getUserData()
      },
      addressId () {
        this.getAddressData()
      },
    },
    mounted () {
      this.getUserData()
      this.getAddressData()
    },
    methods: {
      ...mapActions({
        showSnackBar: 'showSnackBar',
      }),

      getUserData () {
        if (!this.id) return
        this.loading++
        axios.get('map/user/' + this.id)
          .then(res => {
            this.user = res.data.data
          })
          .catch(() => {
            this.showSnackBar({ text: `Cannot download Individual Data for ${this.name}`, color: 'error' })
          })
          .finally(() => {
            this.loading--
          })
      },

      getAddressData () {
        if (!this.addressId) return
        this.loading++
        axios.get('map/user/address/' + this.addressId)
          .then(res => {
            this.address = res.data.data
          })
          .catch(() => {
            this.showSnackBar({ text: `Cannot download Individual Address Data for ${this.name}`, color: 'error' })
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

<style>
</style>
