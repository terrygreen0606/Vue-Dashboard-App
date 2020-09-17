<template>
  <base-material-wizard
    id="add-company-dlg"
    v-model="tab"
    title="Add Company / Plan Holder"
    sub-title="Let's gather some information to start."
    :available-steps="availableSteps"
    :items="tabs"
    class="mx-auto"
    @click:next="nextTab"
    @click:prev="tab--"
  >
    <v-tab-item>
      <v-progress-linear
        v-if="!!loading"
        indeterminate
      />
      <v-form
        v-else
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
              icon="mdi-domain"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="company.name"
              label="Company Name *"
              prepend-icon="mdi-office-building"
              :rules="[v => !!v || 'Company name is required']"
            />
            <v-text-field
              v-model="company.plan_number"
              :loading="searching"
              label="Plan Number"
              prepend-icon="mdi-counter"
              :hint="planNumberError"
              type="number"
              @input="searchPlanNumber"
            />
            <v-switch
              v-model="company.djs_coverage"
              label="Active DJ-S Coverage"
              prepend-icon="mdi-shield-check"
            />
          </v-col>
        </v-row>
        <v-row
          class="mx-auto"
          justify="space-around"
        >
          <v-col
            cols="12"
            md="6"
          >
            <v-autocomplete
              v-model="company.qi"
              :items="qiItems"
              item-text="name"
              item-value="id"
              label="QI"
              clearable
              prepend-icon="mdi-clipboard-account"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-autocomplete
              v-model="company.plan_preparer_id"
              label="Plan Preparer"
              :items="planPreparers"
              item-text="name"
              item-value="id"
              clearable
              prepend-icon="mdi-typewriter"
            />
          </v-col>
        </v-row>
        <v-row
          class="mx-auto"
          justify="space-around"
        >
          <v-col>
            <v-autocomplete
              v-model="company.operating_company"
              :items="companyItems"
              item-text="name"
              item-value="id"
              label="Operating Company"
              clearable
              prepend-icon="mdi-domain"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <v-switch
              v-model="company.is_vendor"
              label="Vendor Active"
              prepend-icon="mdi-check"
            />
          </v-col>
          <v-col
            v-if="company.is_vendor"
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="company.shortname"
              :label="company.vendor_type_id === 6 ? 'Vendor Shortname *' : 'Vendor Shortname'"
              prepend-icon="mdi-face"
              :rules="company.vendor_type_id === 6 ? [v => !!v || 'Shortname is required'] : []"
            />
          </v-col>
        </v-row>
        <v-row
          v-if="company.is_vendor"
          class="mx-auto"
          justify="space-around"
        >
          <v-col>
            <v-select
              v-model="company.vendor_type_id"
              label="Vendor Type"
              :items="vendorTypes"
              item-value="id"
              item-text="name"
              prepend-icon="mdi-format-list-bulleted-type"
            />
          </v-col>
        </v-row>
        <v-row
          class="mx-auto"
          justify="space-around"
        >
          <v-col>
            <v-text-field
              v-model="company.website"
              label="Website"
              prepend-icon="mdi-web"
            />
          </v-col>
        </v-row>
      </v-form>
    </v-tab-item>
    <v-tab-item>
      <v-form
        ref="form2"
        v-model="valid[1]"
      >
        <v-row
          class="mx-auto"
          justify="space-around"
        >
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="company.street"
              :label="company.is_vendor ? 'Street' : 'Street *'"
              :rules="company.is_vendor ? [] : [v => !!v || 'Street is required']"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="company.unit"
              label="Unit"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="company.city"
              :label="company.is_vendor ? 'City' : 'City *'"
              :rules="company.is_vendor ? [] : [v => !!v || 'City is required']"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="company.state"
              label="State/Province"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-autocomplete
              v-model="company.country"
              :items="countryItems"
              item-text="name"
              item-value="id"
              :label="company.is_vendor ? 'Country' : 'Country *'"
              :rules="company.is_vendor ? [] : [v => !!v || 'Country is required']"
            >
              <template
                v-if="company.country"
                v-slot:prepend
              >
                <flag
                  :iso="company.country"
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
              v-model="company.zip"
              label="Zip"
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
            sm="6"
          >
            <v-text-field
              v-model="company.phone_number"
              label="Company Phone Number"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="company.fax"
              label="Fax"
            />
          </v-col>
        </v-row>
        <v-row
          class="mx-auto"
          justify="space-around"
        >
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="company.aoh_phone"
              label="AOH Phone Number (24 Hours)"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="company.work_phone"
              label="Work Phone Number"
            />
          </v-col>
        </v-row>
        <v-row
          class="mx-auto"
          justify="space-around"
        >
          <v-col>
            <v-text-field
              v-model="company.email"
              :loading="searching"
              :label="company.is_vendor ? 'Company Email' : 'Company Email *'"
              :rules="company.is_vendor ? [] : [required, email]"
              :hint="emailError"
              @input="searchEmail"
            />
          </v-col>
        </v-row>
        <v-row
          class="mx-auto"
          justify="space-around"
        >
          <v-col>
            <v-textarea
              v-model="company.comments"
              label="Comments"
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
  import { qiItemsDownload } from '@/mixins/menuItemsDownload/qiItemsDownload'
  import { countryItemsDownload } from '@/mixins/menuItemsDownload/countryItemsDownload'
  import { companyItemsDownload } from '@/mixins/menuItemsDownload/companyItemsDownload'
  import { vendorTypesDownload } from '@/mixins/menuItemsDownload/vendorTypesDownload'
  import { planPreparerDownload } from '@/mixins/menuItemsDownload/planPreparerDownload'

  export default {
    components: {
      ChooseImage: () => import('./ChooseImage'),
    },
    mixins: [
      qiItemsDownload,
      countryItemsDownload,
      companyItemsDownload,
      vendorTypesDownload,
      planPreparerDownload,
    ],
    props: {
      counter: Number,
    },
    data: () => ({
      required: value => !!value || 'This field is required.',
      email: v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      tab: 0,
      tabs: ['Information', 'Address', 'Other Details'],
      company: {},
      squareImg: null,
      rectImg: null,
      valid: [false, false, true],
      loading: 0,
      searching: false,
      planNumberError: null,
      emailError: null,
      timeout: null,
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
    methods: {
      ...mapActions({
        showSnackBar: 'showSnackBar',
      }),
      searchPlanNumber (val) {
        if (this.timeout) clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          if (val.length === 0) {
            this.planNumberError = null
          } else if (val.length < 5) {
            this.planNumberError = 'The minimum length of Plan Number is 5 Digits.'
          } else {
            this.searching = true
            this.getDuplicatePlanNumber(val)
          }
        }, 1000)
      },
      searchEmail (val) {
        if (this.timeout) clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          if (val.length === 0) {
            this.emailError = null
          } else {
            this.searching = true
            this.getDuplicateEmail(val)
          }
        }, 1000)
      },
      getDuplicatePlanNumber (planNumber) {
        axios.get(`companies/duplicatePlan/${planNumber}`)
          .then(res => {
            if (!res.data.success) {
              this.planNumberError = 'That Plan Number already exists.'
            } else {
              this.planNumberError = null
            }
          })
          .finally(() => {
            this.searching = false
          })
      },
      getDuplicateEmail (email) {
        axios.get(`companies/duplicateEmail/${email}`)
          .then(res => {
            if (!res.data.success) {
              this.emailError = 'That Email already exists.'
            } else {
              this.emailError = null
            }
          })
          .finally(() => {
            this.searching = false
          })
      },
      async nextTab () {
        if (!this.valid[this.tab]) return

        if (this.tab < this.tabs.length - 1) {
          this.tab++
        } else {
          const res = await axios.post('companies/create', this.company)
          if (res.data.success) {
            this.additionalAdding(res)
          } else {
            this.$confirm(`${res.data.message} Do you want to proceed?`, { title: 'Duplicates detected.' })
              .then(permitted => {
                if (permitted) {
                  this.company.permitted = true
                  axios.post('companies/create', this.company).then(res => {
                    this.additionalAdding(res)
                  })
                } else {
                  this.$emit('complete', true)
                }
              })
          }
        }
      },
      reset () {
        this.company = {}
        this.tab = 0
        if (this.$refs.form1) this.$refs.form1.resetValidation()
        if (this.$refs.form2) this.$refs.form2.resetValidation()
        if (this.$refs.form3) this.$refs.form3.resetValidation()
      },
      async additionalAdding (res) {
        this.showSnackBar({ text: res.data.message, color: 'success' })
        if (this.rectImg) {
          const formData = new FormData()
          formData.append('file_rect', this.rectImg)
          formData.append('file_sqr', this.squareImg)
          const photoRes = await axios.post(
            `companies/${res.data.id}/setPhoto`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            },
          )
          this.showSnackBar({ text: photoRes.data.message, color: 'success' })
        }
        this.$emit('complete', true)
      },
    },
  }
</script>

<style lang="sass">
#add-company-dlg
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
