<template>
  <v-app-bar
    id="app-bar"
    app
    flat
    height="75"
    class="appbar-testing"
  >
    <v-btn
      class="mr-3"
      elevation="1"
      fab
      small
      @click="$vuetify.breakpoint.smAndDown ? setDrawer(!drawer) : $emit('input', !value)"
    >
      <v-icon v-if="value">
        mdi-view-quilt
      </v-icon>

      <v-icon v-else>
        mdi-dots-vertical
      </v-icon>
    </v-btn>

    <v-toolbar-title
      class="hidden-sm-and-down font-weight-light"
      v-text="$route.name"
    />

    <v-spacer />

    <div class="mx-3" />

    <v-btn
      class="ml-2"
      min-width="0"
      text
      to="/"
    >
      <v-icon>mdi-view-dashboard</v-icon>
    </v-btn>

    <v-menu
      bottom
      left
      offset-y
      origin="top right"
      transition="scale-transition"
    >
      <template v-slot:activator="{ attrs, on }">
        <v-btn
          class="ml-2"
          min-width="0"
          text
          v-bind="attrs"
          v-on="on"
        >
          <v-badge
            color="red"
            overlap
            bordered
          >
            <template v-slot:badge>
              <span>{{ $store.state.menuitems.alertItems && $store.state.menuitems.alertItems.alerts[1].length }}</span>
            </template>

            <v-icon>mdi-bell</v-icon>
          </v-badge>
        </v-btn>
      </template>

      <v-list
        :tile="false"
        nav
      >
        <div v-if="$store.state.menuitems.alertItems && $store.state.menuitems.alertItems.alerts && $store.state.menuitems.alertItems.alerts[1]">
          <div
            v-for="(notification, i) in $store.state.menuitems.alertItems.alerts[1]"
            :key="`item-${i}`"
          >
            <app-bar-item
              v-if="notification.active===1"
            >
              <v-list-item-title v-text="notification.contents" />
            </app-bar-item>
          </div>
        </div>
        <!-- <div v-if="$store.state.menuitems.alertItems.alerts && $store.state.menuitems.alertItems.alerts[2]">
          <div
            v-for="(ais_status, i) in $store.state.menuitems.alertItems.alerts[2]"
            :key="`item-${i}`"
          >
            <app-bar-item
              v-if="ais_status.active===1"
            >
              <v-list-item-title v-text="ais_status.contents" />
            </app-bar-item>
          </div>
        </div> -->
      </v-list>
    </v-menu>

    <v-menu
      bottom
      left
      min-width="200"
      offset-y
      origin="top right"
      transition="scale-transition"
    >
      <template v-slot:activator="{ attrs, on }">
        <v-btn
          class="ml-2"
          min-width="0"
          text
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-shield-account</v-icon>
        </v-btn>
      </template>

      <v-list
        :tile="false"
        flat
        nav
      >
        <template>
          <v-list-item :to="'/individuals/' + $store.state.authentication.user.id">
            My Profile
          </v-list-item>
          <v-list-item :to="'/individuals/' + $store.state.authentication.user.id + '/change-password'">
            Change Password
          </v-list-item>
          <v-divider
            class="mb-2 mt-2"
          />
          <v-list-item
            @click="logout"
          >
            Log Out
          </v-list-item>
        </template>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
  // Utilities
  import { mapState, mapMutations } from 'vuex'
  import { VHover, VListItem } from 'vuetify/lib'

  export default {
    name: 'DashboardCoreAppBar',

    components: {
      AppBarItem: {
        render (h) {
          return h(VHover, {
            scopedSlots: {
              default: ({ hover }) => {
                return h(VListItem, {
                  attrs: this.$attrs,
                  class: {
                    'black--text': !hover,
                    'white--text secondary elevation-12': hover,
                  },
                  props: {
                    activeClass: '',
                    dark: hover,
                    link: true,
                    ...this.$attrs,
                  },
                }, this.$slots.default)
              },
            },
          })
        },
      },
    },

    props: {
      value: {
        type: Boolean,
        default: false,
      },
    },

    data: () => ({
      tab: 1,
    }),
    computed: {
      ...mapState(['drawer']),
    },
    methods: {
      ...mapMutations({
        setDrawer: 'SET_DRAWER',
      }),
      logout () {
        this.$store.dispatch('logout').then(() => this.$router.push('/login'))
      },
    },
  }
</script>
