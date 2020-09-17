<template>
  <base-material-wizard
    id="add-individual-dlg"
    v-model="tab"
    title="Build a profile"
    sub-title="Let's gather some personal, contact and professional details to start."
    :available-steps="availableSteps"
    :items="tabs"
    class="mx-auto"
    @click:next="nextTab"
    @click:prev="tab--"
  >
    <v-tab-item>
      <v-form
        ref="form1"
        v-model="valid[0]"
      >
        <v-row
          class="mx-auto"
          justify="space-around"
        >
          <v-col
            cols="12"
            md="6"
            class="text-center"
          >
            <choose-image
              :square-img.sync="squareImg"
              :rect-img.sync="rectImg"
            />
            <input
              ref="file"
              type="file"
              class="d-none"
              @change="resumeUploaded"
            >
            <v-card
              class="mx-auto mt-4 px-2 d-inline-flex align-center"
              height="80"
              outlined
              @click="$refs.file.click()"
            >
              {{ resume ? resume.name : "Upload Resume" | truncate(16) }}
            </v-card>
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-select
              v-model="user.title"
              :items="['Mr', 'Mrs', 'Ms', 'CAPT']"
              label="Title"
              prepend-icon="mdi-account"
            />
            <v-text-field
              v-model="user.first_name"
              label="First Name *"
              prepend-icon="mdi-account"
              :rules="[v => !!v || 'First name is required']"
            />
            <v-text-field
              v-model="user.last_name"
              label="Last Name *"
              prepend-icon="mdi-account"
              :rules="[v => !!v || 'Last name is required']"
            />
            <v-text-field
              v-model="user.suffix"
              label="Suffix"
              prepend-icon="mdi-account"
            />
          </v-col>
        </v-row>
      </v-form>
    </v-tab-item>
    <v-tab-item>
      <v-progress-linear
        v-if="!!loading"
        indeterminate
      />
      <v-form
        v-else
        ref="form2"
        v-model="valid[1]"
      >
        <v-row>
          <v-col
            cols="12"
            sm="6"
          >
            <v-autocomplete
              v-model="user.company"
              :items="companyItems"
              item-text="name"
              item-value="id"
              label="Company"
              prepend-icon="mdi-domain"
              clearable
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="user.occupation"
              label="Occupation"
              prepend-icon="mdi-briefcase"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-select
              v-model="user.role"
              :items="roleItems"
              item-text="name"
              item-value="id"
              label="User Role"
              prepend-icon="mdi-account-plus"
              clearable
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-autocomplete
              v-model="user.type"
              :items="userTypeItems"
              item-text="name"
              item-value="id"
              label="User Types"
              prepend-icon="mdi-account-child"
              clearable
            />
          </v-col>
          <v-col
            cols="12"
          >
            <v-textarea
              v-model="user.comments"
              label="Comments"
              prepend-icon="mdi-information"
            />
          </v-col>
        </v-row>
      </v-form>
    </v-tab-item>
    <v-tab-item>
      <v-form
        ref="form3"
        v-model="valid[2]"
      >
        <v-row
          class="mx-auto"
          justify="space-around"
        >
          <v-col
            cols="12"
            class="text-center"
          >
            <v-btn
              color="success"
              type="button"
              :disabled="user.company ? false : true"
              :loading="importing"
              @click="importCompanyContact"
            >
              <v-icon left>
                mdi-domain
              </v-icon>
              Import Company Contact Info
            </v-btn>
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="user.street"
              label="Street *"
              :rules="[v => !!v || 'Street is required']"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="user.unit"
              label="Unit"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="user.city"
              label="City *"
              :rules="[v => !!v || 'City is required']"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="user.state"
              label="State/Province"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-autocomplete
              v-model="user.country"
              :items="countryItems"
              item-text="name"
              item-value="id"
              label="Country *"
              :rules="[v => !!v || 'Country is required']"
            >
              <template
                v-if="user.country"
                v-slot:prepend
              >
                <flag
                  :iso="user.country"
                  :squared="false"
                />
              </template>
              <template
                v-else
                v-slot:prepend
              >
                <v-icon>mdi-flag</v-icon>
              </template>
            </v-autocomplete>
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="user.zip"
              label="Zip"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="user.homeNumber"
              label="Home Number"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="user.mobileNumber"
              label="Mobile Number"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="user.work_phone"
              label="Work Phone"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="user.aoh_phone"
              label="AOH Phone"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="user.fax"
              label="Fax"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="user.email"
              :loading="searchingEmail"
              label="Email *"
              :hint="emailError"
              :rules="[v => !!v || 'Email is required']"
              @input="searchEmail"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="user.alternate_email"
              label="Alternate Email"
            />
          </v-col>
        </v-row>
      </v-form>
    </v-tab-item>
  </base-material-wizard>
</template>

<script>
  import axios from 'axios'
  import { mapActions } from 'vuex'
  import { companyItemsDownload } from '@/mixins/menuItemsDownload/companyItemsDownload'
  import { roleItemsDownload } from '@/mixins/menuItemsDownload/roleItemsDownload'
  import { userTypeItemsDownload } from '@/mixins/menuItemsDownload/userTypeItemsDownload'
  import { countryItemsDownload } from '@/mixins/menuItemsDownload/countryItemsDownload'

  export default {
    components: {
      ChooseImage: () => import('./ChooseImage'),
    },
    mixins: [
      companyItemsDownload,
      roleItemsDownload,
      userTypeItemsDownload,
      countryItemsDownload,
    ],
    props: {
      counter: Number,
      company: String,
    },
    data: () => ({
      tab: 0,
      tabs: ['Personal', 'Professional', 'Contact'],
      user: {},
      squareImg: null,
      rectImg: null,
      valid: [false, false, true],
      resume: null,
      loading: 0,
      searchingEmail: false,
      emailError: null,
      timeout: null,
      importing: false,
    }),
    computed: {
      availableSteps () {
        const steps = [0]
        if (this.valid[0]) steps.push(1)
        if (this.valid[1]) steps.push(2)
        if (this.valid[2]) steps.push(3)
        return steps
      },
    },
    watch: {
      counter () {
        this.reset()
      },
    },
    mounted () {
      if (this.company) {
        this.user.company = parseInt(this.company)
        this.importCompanyContact()
      }
    },
    methods: {
      ...mapActions({
        showSnackBar: 'showSnackBar',
      }),
      searchEmail (val) {
        if (this.timeout) clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          if (val.length === 0) {
            this.emailError = null
          } else if (!/.+@.+\..+/.test(val)) {
            this.emailError = 'That Email is invalid'
          } else {
            this.searchingEmail = true
            this.getDuplicateUser(val)
          }
        }, 1000)
      },
      getDuplicateUser (email) {
        axios.get(`users/duplicateEmail/${email}`)
          .then(res => {
            if (!res.data.success) {
              this.emailError = 'That Email already exists.'
            } else {
              this.emailError = null
            }
          })
          .finally(() => {
            this.searchingEmail = false
          })
      },
      async nextTab () {
        if (!this.valid[this.tab]) return

        if (this.tab < this.tabs.length - 1) {
          this.tab++
        } else {
          if (this.$refs.form3.validate()) {
            this.user.username = this.user.email
            try {
              let response = await axios.post('users/create', this.user)
              if (response.data.success) {
                this.showSnackBar({ text: response.data.message, color: 'success' })
              } else {
                const decision = await this.$confirm(`${response.data.message} Do you want to proceed?`, { title: 'Duplicate Detected' })
                if (decision) {
                  this.user.permitted = true
                  response = await axios.post('users/create', this.user)
                  response.data.success
                    ? this.showSnackBar({ text: response.data.message, color: 'success' })
                    : this.showSnackBar({ text: response.data.message, color: 'error' })
                }
              }
              this.additionalAdding(response)
              this.$emit('complete', true)
            } catch (err) {
              this.showSnackBar({ text: err, color: 'error' })
            }
          }
        }
      },
      reset () {
        this.user = {}
        this.tab = 0
        if (this.$refs.form1) this.$refs.form1.resetValidation()
        if (this.$refs.form2) this.$refs.form2.resetValidation()
        this.resume = null
      },
      resumeUploaded (event) {
        this.resume = event.target.files[0]
      },
      additionalAdding (res) {
        if (this.rectImg) {
          const formData = new FormData()
          formData.append('file_rect', this.rectImg)
          formData.append('file_sqr', this.squareImg)
          axios.post(
            `users/${res.data.id}/setPhoto`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            },
          ).then(res => {
            this.showSnackBar({ text: res.data.message, color: 'success' })
          }).catch(error => {
            this.showSnackBar({ text: error.response.data.message || error.response.data.statusText, color: 'error' })
          })
        }

        if (this.resume) {
          const formData = new FormData()
          formData.append('file', this.resume)
          axios.post(
            `users/${res.data.id}/files/documents/cv/upload`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            },
          ).then(res1 => {
            this.showSnackBar({ text: 'Resume uploaded', color: 'success' })
            axios.post(`users/${res.data.id}/resumeUpdate`, { resume_link: res1.data.filename })
          }).catch(error => {
            this.showSnackBar({ text: error.response.data.message || error.response.data.statusText, color: 'error' })
          })
        }
      },
      async importCompanyContact () {
        this.importing = true
        try {
          const companyResponse = await axios.get('companies/' + this.user.company)
          const basicInfo = companyResponse.data.data[0]
          this.user.work_phone = basicInfo.work_phone
          this.user.aoh_phone = basicInfo.aoh_phone
          this.user.fax = basicInfo.fax

          const response = await axios.get('companies/' + this.user.company + '/addresses')
          const addressInfo = response.data.find(address => address.name === 'Primary').addresses[0]
          if (addressInfo) {
            this.user.street = addressInfo.street
            this.user.unit = addressInfo.unit
            this.user.city = addressInfo.city
            this.user.state = addressInfo.state
            this.user.country = addressInfo.country
            this.user.zip = addressInfo.zip
          } else {
            this.showSnackBar({ text: 'The company does not have an address.', color: 'warning' })
          }
        } catch (err) {
          this.showSnackBar({ text: err, color: 'error' })
        }
        this.importing = false
      },
    },
  }
</script>

<style lang="sass">
#add-individual-dlg
  @media (max-width: 900px)
    .v-tabs-bar__content
      flex-direction: column
    .v-tabs-bar--is-mobile
      height: 150px !important
    .v-tab--active
      background-color: #023b68
      border-color: #023b68
    .v-tabs-slider-wrapper
      display: none
</style>
