<template>
  <v-navigation-drawer
    id="core-navigation-drawer"
    v-model="drawer"
    :dark="barColor !== 'rgba(228, 226, 226, 1), rgba(255, 255, 255, 0.7)'"
    :expand-on-hover="expandOnHover"
    :right="$vuetify.rtl"
    :src="barImage"
    mobile-breakpoint="960"
    app
    mini-variant-width="98"
    width="260"
    v-bind="$attrs"
  >
    <template v-slot:img="props">
      <v-img
        :gradient="`to bottom, ${barColor}`"
        v-bind="props"
      />
    </template>

    <v-list-item>
      <v-list-item-content>
        <div class="logo-mini">
          <v-img src="@/assets/djs-avatar.png" />
        </div>
        <div class="logo-normal">
          <router-link to="/">
            <v-img src="@/assets/djs-logo.png" />
          </router-link>
        </div>
      </v-list-item-content>
    </v-list-item>

    <v-divider class="mb-1" />

    <v-list
      dense
      nav
    >
      <base-item-group
        :item="profile"
      />
    </v-list>

    <v-divider class="mb-2" />

    <v-list
      expand
      nav
    >
      <!-- Style cascading bug  -->
      <!-- https://github.com/vuetifyjs/vuetify/pull/8574 -->
      <template v-for="(item, i) in computedItems">
        <base-item-group
          v-if="item && item.children"
          :key="`group-${i}`"
          :item="item"
          @click.native="closeOthers(i)"
        >
          <!--  -->
        </base-item-group>

        <base-item
          v-else-if="item"
          :key="`item-${i}`"
          :item="item"
        />
      </template>

      <template>
        <v-list-item
          href="https://www.donjon.com"
          target="_blank"
        >
          <v-list-item-avatar style="width: 24px; height: 24px; min-width: 24px; margin: 0">
            <v-img src="@/assets/icons/donjon.svg" />
          </v-list-item-avatar>
          <span class="v-list-item__title">DONJON</span>
        </v-list-item>
        <v-list-item
          href="https://www.smit.com/#view/map"
          target="_blank"
        >
          <v-list-item-avatar style="width: 24px; height: 24px; min-width: 24px; margin: 0">
            <v-img src="@/assets/icons/smit.svg" />
          </v-list-item-avatar>
          <span class="v-list-item__title">SMIT</span>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
  // Utilities
  import {
    mapState,
    mapMutations,
  } from 'vuex'
  import { guardRoute } from '../../../../shared/management'

  export default {
    name: 'DashboardCoreDrawer',

    props: {
      expandOnHover: {
        type: Boolean,
        default: false,
      },
    },

    data: () => ({
      items: [
        {
          icon: 'mdi-view-dashboard',
          title: 'Dashboard',
          to: '/',
          active: false,
        },
        {
          group: '',
          icon: 'mdi-paperclip',
          title: 'Administration',
          active: false,
          children: [
            {
              icon: 'mdi-newspaper',
              title: 'Admin Workflow',
              to: 'admin-workflow',
            },
            {
              icon: 'mdi-bell',
              title: 'Alerts System',
              to: 'alerts',
            },
            {
              icon: 'mdi-file-document',
              title: 'System Reports',
              to: 'reports',
            },
            // {
            //   icon: 'mdi-cog',
            //   title: 'User Permissions',
            //   to: 'user-permissions',
            // },
          ],
        },
        {
          group: '',
          icon: 'mdi-compass-rose',
          title: 'Navigate',
          active: false,
          children: [
            {
              icon: 'mdi-map-search',
              title: 'COP Map',
              to: 'map',
            },
            {
              icon: 'mdi-map-marker',
              title: 'Latest AIS Positions',
              to: 'latest-ais-positions',
            },
            {
              icon: 'mdi-radio-tower',
              title: 'AIS',
              to: 'ais',
            },
            {
              icon: 'mdi-anchor',
              title: 'Fleets',
              to: 'fleets',
            },
          ],
        },
        {
          group: '',
          icon: 'mdi-account-check',
          title: 'NPREP',
          active: false,
          children: [
            {
              text: 'TTX',
              to: 'ttx',
              title: 'Tabletop Exercise',
            },
            {
              text: 'RACE',
              to: 'race',
              title: 'Remote Assessment',
            },
          ],
        },
        {
          icon: 'mdi-domain',
          title: 'Companies',
          to: '/companies',
          active: false,
        },
        {
          icon: 'mdi-ferry',
          title: 'Vessels',
          to: '/vessels',
          active: false,
        },
        {
          icon: 'mdi-account-group',
          title: 'Individuals',
          to: '/individuals',
          active: false,
        },
        {
          icon: 'mdi-map',
          title: 'Geographic Annexes',
          to: '/gsa',
          active: false,
        },
      ],
    }),

    computed: {
      ...mapState({
        barColor: state => state.sidebar.barColor,
        barImage: state => state.sidebar.barImage,
        role: state => state.authentication.role,
      }),
      drawer: {
        get () {
          return this.$store.state.sidebar.drawer
        },
        set (val) {
          this.$store.commit('SET_DRAWER', val)
        },
      },
      computedItems () {
        if (!this.role) return []
        else {
          return this.items.filter(item => guardRoute(item.title, this.role.id)).map(this.mapItem)
        }
      },
      profile () {
        const profile = {
          avatar: this.$store.state.authentication.user.has_photo ? '' : true,
          group: '',
          img: this.$store.state.authentication.user.has_photo ? `https://storage.googleapis.com/donjon-smit/pictures/individuals/${this.$store.state.authentication.user.id}/cover_sqr.jpg?${new Date().getTime()}` : '',
          title: this.$store.state.authentication.user.full_name,
          active: false,
          children: [
            {
              icon: 'mdi-shield-account',
              to: 'individuals/' + this.$store.state.authentication.user.id + '/general',
              title: 'My Profile',
            },
            {
              icon: 'mdi-lock-reset',
              to: 'individuals/' + this.$store.state.authentication.user.id + '/change-password',
              title: 'Change Password',
            },
          ],
        }
        if (this.role && guardRoute('Individual / Capabilities', this.role.id)) {
          profile.children.push({
            icon: 'mdi-badge-account',
            to: 'individuals/' + this.$store.state.authentication.user.id + '/smff',
            title: 'Update Capabilities',
          })
        }
        return profile
      },
    },

    watch: {
      '$vuetify.breakpoint.smAndDown' (val) {
        this.$emit('update:expandOnHover', !val)
      },
    },

    mounted () {
      this.$nextTick(() => {
        /**
         * fix app sidebar disappearing issue on mobile
         */
        (() => {
          const target = document.getElementById('core-navigation-drawer')
          target.style.height = '100%'
          const observer = new MutationObserver(mutations => {
            const drawerStyles = target.style
            if (drawerStyles.transform === 'translateX(-100%)' && this.$vuetify.breakpoint.mdAndUp) {
              this.setDrawer(false)
              this.setDrawer(true)
            }
          })
          observer.observe(target, { attributes: true, attributeFilter: ['style'] })
        })()
      })
    },

    methods: {
      ...mapMutations({
        setDrawer: 'SET_DRAWER',
      }),
      mapItem (item) {
        if (item.children) {
          const children = item.children.filter(child => guardRoute(child.title, this.role.id))
          if (children.length) {
            return {
              ...item,
              children: children.map(this.mapItem),
            }
          }
        } else return item
      },
      closeOthers (val) {
        this.items = this.items.map((item, i) => {
          if (val !== i) {
            return { ...item, active: false }
          } else {
            return item
          }
        })
      },
    },
  }
</script>

<style lang="sass">
  @import '~vuetify/src/styles/tools/_rtl.sass'

  #core-navigation-drawer
    &.v-navigation-drawer--mini-variant
      .v-list-item
        justify-content: center

      .v-list-group--sub-group
        display: block !important

    .v-list-group__header.v-list-item--active:before
      opacity: .24

    .v-list-item
      &__icon--text,
      &__icon:first-child
        justify-content: center
        text-align: center
        width: 20px
        margin-right: 0px !important

        +ltr()
          margin-right: 24px
          margin-left: 0px !important

        +rtl()
          margin-left: 24px
          margin-right: 12px !important

    .v-list--dense
      .v-list-item
        &__icon--text,
        &__icon:first-child
          margin-top: 10px

    .v-list-group--sub-group
      .v-list-item
        +ltr()
          padding-left: 8px

        +rtl()
          padding-right: 8px

      .v-list-group__header
        +ltr()
          padding-right: 0

        +rtl()
          padding-right: 0

        .v-list-item__icon--text
          margin-top: 19px
          order: 0

        .v-list-group__header__prepend-icon
          order: 2

          +ltr()
            margin-right: 8px

          +rtl()
            margin-left: 8px
    .logo-normal
      max-width: 60%
      margin: auto
      transition: all 250ms linear
    .logo-mini
      opacity: 0
      max-width: 34px
      height: 34px
      margin: auto
      overflow: hidden
      border-radius: 50%
      position: absolute
      transition: all 250ms linear

    .v-list-item__title
      margin-left: 24px

  .v-navigation-drawer--mini-variant
    .logo-normal
      opacity: 0 !important
      position: absolute
    .logo-mini
      opacity: 1 !important
      position: initial !important

  .text-label
    margin-top: 12px

  .v-navigation-drawer__content
    overflow-y: auto

</style>
