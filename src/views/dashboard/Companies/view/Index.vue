<template>
  <v-container fluid>
    <input
      ref="file"
      type="file"
      class="d-none"
      @change="uploadPhoto"
    >
    <base-material-tabs
      v-model="activeTab"
      background-color="transparent"
      centered
      color="secondary"
      icons-and-text
      show-arrows
    >
      <template v-for="(tab, i) in tabs">
        <v-tab
          :key="i"
          :to="tab.to"
        >
          {{ tab.title }}
          <v-icon v-text="tab.icon" />
        </v-tab>
      </template>
    </base-material-tabs>
    <router-view v-if="shouldHideProfile" />
    <v-row v-else>
      <v-col class="d-md-none">
        <base-material-card
          class="v-card-profile cdt-info-card"
          image
          color="white"
          hover-reveal
        >
          <template v-slot:image>
            <v-img
              v-if="coverPhotoUrl"
              :src="coverPhotoUrl"
              class="new-image-link"
              @click="openNewTab(coverPhotoUrl)"
            />
            <v-icon
              v-else
              size="100"
              color="grey"
            >
              mdi-domain
            </v-icon>
          </template>
          <template v-slot:reveal-actions>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  color="secondary"
                  icon
                  v-on="on"
                  @click="$refs.file.click()"
                >
                  <v-icon>
                    mdi-pencil
                  </v-icon>
                </v-btn>
              </template>
              Upload/Change Image
            </v-tooltip>
          </template>
          <v-card-text class="text-center">
            <h4 class="display-2 font-weight-light mb-3 black--text">
              {{ editedItem.name }}
            </h4>
            <h6 class="display-1 mb-1 grey--text">
              VRP Number: {{ editedItem.plan_number }}
            </h6>
            <p class="display-1 font-weight-light grey--text">
              {{ editedItem.description }}
            </p>
            <a
              class="display-1 mb-1 black--text"
              :href="editedItem.website"
              target="_blank"
            >
              {{ editedItem.website }}
            </a>
          </v-card-text>
        </base-material-card>
      </v-col>
      <v-col
        cols="12"
        md="8"
      >
        <router-view :exist="existOpa" />
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <base-material-card
          class="v-card-profile cdt-info-card hidden-sm-and-down"
          image
          color="white"
          hover-reveal
        >
          <template v-slot:image>
            <v-img
              v-if="coverPhotoUrl"
              :src="coverPhotoUrl"
              class="new-image-link"
              @click="openNewTab(coverPhotoUrl)"
            />
            <v-icon
              v-else
              size="100"
              color="grey"
            >
              mdi-domain
            </v-icon>
          </template>
          <template v-slot:reveal-actions>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  color="secondary"
                  icon
                  v-on="on"
                  @click="$refs.file.click()"
                >
                  <v-icon>
                    mdi-pencil
                  </v-icon>
                </v-btn>
              </template>
              Upload/Change Image
            </v-tooltip>
          </template>
          <v-card-text class="text-center">
            <h4 class="display-2 font-weight-light mb-3 black--text">
              {{ editedItem.name }}
            </h4>
            <h6 class="display-1 mb-1 grey--text">
              VRP Number: {{ editedItem.plan_number }}
            </h6>
            <p class="display-1 font-weight-light grey--text">
              {{ editedItem.description }}
            </p>
            <a
              class="display-1 mb-1 black--text"
              :href="editedItem.website"
              target="_blank"
            >
              {{ editedItem.website }}
            </a>
          </v-card-text>
        </base-material-card>
        <base-material-card
          color="primary"
          icon="mdi-checkbox-multiple-marked"
          title="Activate Options"
        >
          <div class="status-badge">
            <v-badge
              bottom
              bordered
              overlap
              :icon="editedItem.networks_active === 1 ? 'mdi-star' : 'mdi-hard-hat'"
              :color="editedItem.networks_active === 1 ? 'warning' : 'secondary'"
              :value="editedItem.networks_active === 1 || editedItem.capabilies_active === 1"
            >
              <span>
                <v-icon
                  v-if="editedItem.vrp_import === 1"
                  color="gray"
                  size="30"
                >
                  mdi-shield-search
                </v-icon>
                <v-icon
                  v-else-if="editedItem.vendor_active === 1"
                  color="secondary"
                  size="30"
                >
                  mdi-shield-link-variant
                </v-icon>
                <v-icon
                  v-else-if="editedItem.active"
                  color="success"
                  size="30"
                >
                  mdi-shield-check
                </v-icon>
                <v-icon
                  v-else
                  color="error"
                  size="30"
                >
                  mdi-shield-off
                </v-icon>
              </span>
            </v-badge>
          </div>
          <v-switch
            v-model="editedItem.active"
            label="DJ-S SMFF Coverage Active"
            @click.stop="toggleStatus"
          />
          <v-switch
            v-model="smff"
            class="mt-0 pt-0"
            label="Capabilities"
            @click.stop="toggleSMFF"
          />
          <v-switch
            v-model="editedItem.networks_active"
            class="mt-0 pt-0"
            label="Network Membership"
            @click.stop="toggleNetworks"
          />
          <v-switch
            v-model="editedItem.vendor_active"
            class="ma-0 pa-0"
            label="Vendor"
            @click.stop="toggleVendor"
          />
          <template v-if="role && checkCUD(role.id)">
            <v-select
              v-if="editedItem.vendor_active && role && checkCUD(role.id)"
              v-model="editedItem.vendor_type_id"
              class="ma-0 pa-0 mb-3"
              label="Vendor Type"
              :items="vendorTypes"
              item-text="name"
              item-value="id"
              prepend-icon="mdi-format-list-bulleted-type"
              @change="changeVendor(editedItem.id, editedItem.vendor_type_id)"
            />
          </template>
          <template v-else>
            <v-text-field
              v-model="editedItem.vendor_type"
              class="ma-0 pa-0 mb-3"
              readonly
              prepend-icon="mdi-format-list-bulleted-type"
              hide-details
              label="Vendor Type"
            />
          </template>
        </base-material-card>
        <base-material-card
          v-if="editedItem.networks_active"
          color="primary"
          title="Network Membership"
          icon="mdi-security-network"
        >
          <v-progress-linear
            v-if="activatingNetwork || !!loading"
            indeterminate
          />
          <v-row class="mb-5" />
          <v-switch
            v-for="networkItem in networkItems"
            :key="networkItem.id"
            v-model="networks"
            :value="networkItem.code"
            class="mt-0 pt-0"
            :label="networkItem.name"
            @change="activateNetwork"
          />
        </base-material-card>
      </v-col>
    </v-row>
    <v-dialog
      v-model="cropper.show"
      max-width="700"
    >
      <image-cropper
        :image="cropper.image"
        :cnt="cropper.cnt"
        @close="cropper.show = false"
        @upload="uploadCroppedImages"
      />
    </v-dialog>
  </v-container>
</template>

<script>
  import axios from 'axios'
  import { mapActions, mapState } from 'vuex'
  import { networkItemsDownload } from '@/mixins/menuItemsDownload/networkItemsDownload'
  import { vendorTypesDownload } from '@/mixins/menuItemsDownload/vendorTypesDownload'
  import { checkCompaniesTab, checkCUD } from '@/shared/management'

  export default {
    components: {
      ImageCropper: () => import('../../components/ImageCropper'),
    },
    mixins: [
      networkItemsDownload, vendorTypesDownload,
    ],
    data: () => ({
      activeTab: 0,
      editedItem: {},
      networks: [],
      msgBox: false,
      smff: null,
      vendor_active: null,
      activatingNetwork: false,
      cropper: {
        show: false,
        image: null,
        cnt: 0,
      },
      loading: 0,
      coverPhotoUrl: '',
      checkCUD,
    }),
    computed: {
      ...mapState({
        role: state => state.authentication.role,
      }),
      tabs () {
        if (this.role) return checkCompaniesTab(this.role.id).map(tab => ({ ...tab, to: '/companies/' + this.$route.params.id + '/' + tab.to }))
        else return []
      },
      shouldHideProfile () {
        const path = this.$route.path
        return path.endsWith('files') ||
          path.endsWith('affiliates') ||
          path.endsWith('individuals') ||
          path.endsWith('vessels') ||
          path.endsWith('smff')
      },
      existOpa () {
        if (this.editedItem.networks_active && this.networks.includes('opa_90')) return 1
        else return 0
      },
    },
    watch: {
      $route (to, from) {
        if (to.params.id !== from.params.id || from.fullPath.endsWith('smff')) {
          this.getDataFromApi()
        }
      },
    },
    mounted () {
      this.getDataFromApi()
    },
    methods: {
      ...mapActions({
        showSnackBar: 'showSnackBar',
      }),
      uploadPhoto (event) {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        const file = event.target.files[0]
        if (file.type.indexOf('image/') !== -1) {
          const fileReader = new FileReader()
          fileReader.onload = e => {
            this.cropper.image = e.target.result
            this.cropper.cnt++
            this.cropper.show = true
          }
          fileReader.readAsDataURL(file)
        }
        event.target.value = null
      },
      uploadCroppedImages (squareImg, rectImg) {
        this.cropper.show = false
        const formData = new FormData()
        formData.append('file_rect', rectImg)
        formData.append('file_sqr', squareImg)
        axios.post(
          `companies/${this.$route.params.id}/setPhoto`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        ).then(res => {
          this.editedItem.has_photo = true
          this.makeCoverPhotoUrl()
          this.showSnackBar({ text: res.data.message, color: 'success' })
        }).catch(error => {
          this.showSnackBar({ text: error, color: 'error' })
        })
      },
      getDataFromApi () {
        axios.get('companies/' + this.$route.params.id)
          .then(res => {
            this.editedItem = res.data.data[0]
            this.makeCoverPhotoUrl()
          })
        axios.get('companies/' + this.$route.params.id + '/smff')
          .then(response => {
            this.smff = response.data.smff
            this.networks = response.data.networks
          })
      },
      toggleStatus () {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        axios.post('companies/' + this.$route.params.id + '/toggleStatus')
          .then(res => {
            this.showSnackBar({ text: res.data.message, color: 'success' })
            this.getDataFromApi()
          })
      },
      toggleSMFF () {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        if (this.smff) {
          axios.delete('companies/' + this.$route.params.id + '/smff')
            .then(res => {
              this.showSnackBar({ text: res.data.message, color: 'success' })
              this.getDataFromApi()
            })
        } else {
          axios.post('companies/' + this.$route.params.id + '/smff/create')
            .then(res => {
              this.showSnackBar({ text: res.data.message, color: 'success' })
              this.getDataFromApi()
            })
        }
      },
      toggleVendor () {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        axios.post('companies/' + this.$route.params.id + '/toggleVendor')
          .then(res => {
            this.showSnackBar({ text: res.data.message, color: 'success' })
            this.getDataFromApi()
          })
      },
      toggleNetworks () {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        axios.post('companies/' + this.$route.params.id + '/toggleNetworks')
          .then(res => {
            this.showSnackBar({ text: res.data.message, color: 'success' })
            this.getDataFromApi()
          })
      },
      activateNetwork () {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        this.activatingNetwork = true
        axios.post(`companies/${this.$route.params.id}/network`, { networks: this.networks })
          .then(res => {
            this.showSnackBar({ text: res.data.message, color: 'success' })
            this.activatingNetwork = false
          })
      },
      changeVendor (companyId, vendorTypeId) {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        const request = { company_id: companyId, vendor_type_id: vendorTypeId }
        axios.post('vendor/type', request)
          .then(res => {
            res.data.success
              ? this.showSnackBar({ text: res.data.message, color: 'success' })
              : this.showSnackBar({ text: res.data.message, color: 'error' })
          })
          .catch(err => {
            this.showSnackBar({ text: err, color: 'error' })
            this.getDataFromApi()
          })
      },
      makeCoverPhotoUrl () {
        this.coverPhotoUrl = this.editedItem.has_photo
          ? `https://storage.googleapis.com/donjon-smit/pictures/companies/${this.$route.params.id}/cover_sqr.jpg?${new Date().getTime()}`
          : ''
      },
      openNewTab (url) {
        window.open(url, '_blank')
      },
    },
  }
</script>

<style lang="sass">
.v-input__slot
  margin-bottom: 0
.new-image-link
  cursor: pointer
</style>
