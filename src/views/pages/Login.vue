<template>
  <v-container
    id="login"
    class="fill-height justify-center"
    tag="section"
    @keyup.enter="login"
  >
    <v-row justify="center">
      <v-slide-y-transition appear>
        <base-material-card
          color="white"
          light
          max-width="100%"
          width="400"
          class="px-5 py-3"
        >
          <template v-slot:heading>
            <v-img
              src="@/assets/djs-logo-black.png"
              width="150"
              class="mx-auto"
            />
          </template>

          <v-card-text class="text-center">
            <v-alert
              v-model="loginFailed"
              type="error"
              class="white--text"
              dense
              dismissible
            >
              Login failed
            </v-alert>

            <v-text-field
              v-model="username"
              color="secondary"
              label="User Name"
              prepend-icon="mdi-account-outline"
              hide-details
            />

            <v-text-field
              v-model="password"
              class="mb-8"
              color="secondary"
              label="Password"
              prepend-icon="mdi-lock-outline"
              type="password"
              hide-details
            />

            <pages-btn
              large
              color=""
              depressed
              class="v-btn--text success--text"
              @click="login"
            >
              Let's Go
            </pages-btn>
          </v-card-text>
        </base-material-card>
      </v-slide-y-transition>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'PagesLogin',

    components: {
      PagesBtn: () => import('./components/Btn'),
    },

    data: () => ({
      username: '',
      password: '',
      rememberMe: false,
      loginFailed: false,
    }),
    methods: {
      login () {
        const { username, password } = this
        if (username && password) {
          this.$store.dispatch('login', {
            username: this.username,
            password: this.password,
            rememberMe: this.rememberMe,
          }).then(res => {
            this.$store.dispatch('initMenuItems')
            this.$router.push('/')
          }).catch(() => {
            this.loginFailed = true
          })
        }
      },
    },
  }
</script>
