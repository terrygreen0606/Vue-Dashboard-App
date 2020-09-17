<template>
  <v-container
    id="lock"
    class="fill-height"
    tag="section"
  >
    <v-row justify="center">
      <v-slide-y-transition appear>
        <v-card
          class="mt-6 mt-md-0"
          light
          max-width="100%"
          width="250"
        >
          <v-progress-linear
            v-if="loading"
            indeterminate
          />
          <v-card-text class="text-center">
            <v-avatar
              class="mt-n12 mb-6 elevation-12"
              color="white"
              size="88"
            >
              <v-img
                v-if="user.has_photo"
                :src="`https://storage.googleapis.com/donjon-smit/pictures/individuals/${$route.params.id}/cover_sqr.jpg`"
              />
              <v-icon
                v-else
                size="50"
                color="grey"
              >
                mdi-account
              </v-icon>
            </v-avatar>

            <div class="display-2 font-weight-light mb-3 text--darken-2 grey--text">
              {{ user.full_name }}
            </div>
            <v-text-field
              v-model="password"
              class="mb-8"
              color="secondary"
              label="Password"
              prepend-icon="mdi-lock-outline"
              type="password"
              hide-details
              @keydown.enter="checkPassword"
            />

            <pages-btn
              large
              text
              depressed
              class="v-btn--text success--text"
              @click="checkPassword"
            >
              Unlock
            </pages-btn>
          </v-card-text>
        </v-card>
      </v-slide-y-transition>
    </v-row>
  </v-container>
</template>

<script>
  import axios from 'axios'
  import { mapActions, mapState } from 'vuex'
  export default {
    name: 'PagesLock',
    components: {
      PagesBtn: () => import('./components/Btn'),
    },
    data: () => ({
      password: '',
      changeable: false,
      loading: false,
    }),
    beforeRouteLeave (to, from, next) {
      if (this.changeable) {
        next()
      } else {
        this.$router.push(from.fullPath).catch(() => {})
      }
    },
    computed: {
      ...mapState({
        user: state => state.authentication.user,
      }),
    },
    methods: {
      ...mapActions({
        showSnackBar: 'showSnackBar',
      }),
      checkPassword () {
        this.loading = true
        axios.get('checkPassword', { params: { id: this.user.id, password: this.password } })
          .then(res => {
            if (!res.data.success) {
              this.showSnackBar({ text: res.data.message, color: 'warning' })
            } else {
              this.changeable = res.data.success
              this.$router.go(-1)
            }
            this.loading = false
          })
      },
    },
  }
</script>
