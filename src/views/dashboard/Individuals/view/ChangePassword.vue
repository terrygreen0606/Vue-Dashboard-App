<template>
  <v-container>
    <base-material-card
      color="primary"
      title="Password"
    >
      <v-card-text>
        <v-row>
          <v-col
            cols="8"
            sm="4"
          >
            <v-text-field
              v-if="!showpwd"
              v-model="password.password"
              label="Password"
              type="password"
            />
            <v-text-field
              v-else
              v-model="password.password"
              label="Password"
              type="text"
            />
          </v-col>
          <v-col
            cols="4"
            sm="2"
            class="mt-5 pl-0"
          >
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  small
                  class="mr-2"
                  v-on="on"
                  @click="showHidepwd"
                >
                  <v-icon
                    v-if="showpwd"
                    size="28"
                    color="primary"
                  >
                    mdi-eye
                  </v-icon>
                  <v-icon
                    v-else
                    size="28"
                    color="gray"
                  >
                    mdi-eye-off
                  </v-icon>
                </v-btn>
              </template>
              <span v-if="showpwd">Hide Password</span>
              <span v-else>Show Password</span>
            </v-tooltip>
          </v-col>
          <v-col
            cols="8"
            sm="4"
          >
            <v-text-field
              v-if="!confirmpwd"
              v-model="password_confirmation"
              label="Confirm Password"
              type="password"
            />
            <v-text-field
              v-else
              v-model="password_confirmation"
              label="Confirm Password"
              type="text"
            />
          </v-col>
          <v-col
            cols="4"
            sm="2"
            class="mt-5 pl-0"
          >
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  small
                  class="mr-2"
                  v-on="on"
                  @click="showHideConfirmPwd"
                >
                  <v-icon
                    v-if="confirmpwd"
                    size="28"
                    color="primary"
                  >
                    mdi-eye
                  </v-icon>
                  <v-icon
                    v-else
                    size="28"
                    color="gray"
                  >
                    mdi-eye-off
                  </v-icon>
                </v-btn>
              </template>
              <span v-if="confirmpwd">Hide Confirm Password</span>
              <span v-else>Show Confirm Password</span>
            </v-tooltip>
          </v-col>
          <v-btn
            color="primary"
            :disabled="password.password !== password_confirmation"
            @click="changePassword"
          >
            Change Password
          </v-btn>
        </v-row>
      </v-card-text>
    </base-material-card>
  </v-container>
</template>

<script>
  import axios from 'axios'
  import { mapActions } from 'vuex'

  export default {
    data: () => ({
      password: {
        user_id: -1,
        password: '',
      },
      password_confirmation: '',
      showpwd: false,
      confirmpwd: false,
    }),
    mounted () {
      this.password.user_id = this.$route.params.id
    },
    methods: {
      ...mapActions({
        showSnackBar: 'showSnackBar',
      }),
      changePassword () {
        this.$confirm('Do you want to change the password?')
          .then(res => {
            if (res) {
              axios.post('changePassword', { password: this.password })
                .then(res => {
                  this.showSnackBar({ text: res.data.message, color: 'success' })
                }).catch(error => {
                  this.showSnackBar({ text: error.response.statusText, color: 'error' })
                })
            }
          })
      },
      showHidepwd () {
        this.showpwd = !this.showpwd
      },
      showHideConfirmPwd () {
        this.confirmpwd = !this.confirmpwd
      },
    },
  }
</script>
