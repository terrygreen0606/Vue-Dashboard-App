<template>
  <v-container
    id="vessels-index"
    fluid
  >
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
    <v-row v-if="showRightBar">
      <v-col class="d-md-none">
        <base-material-card
          class="v-card-profile cdt-info-card mb-0"
          image
          color="white"
          hover-reveal
        >
          <v-progress-linear
            v-if="uploadingImage || !!loading"
            indeterminate
          />
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
              mdi-ferry
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
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  color="secondary"
                  icon
                  v-on="on"
                  @click="importPhoto"
                >
                  <v-icon>
                    mdi-auto-fix
                  </v-icon>
                </v-btn>
              </template>
              Import Vessel Photo
            </v-tooltip>
          </template>
          <v-card-text class="text-center">
            <h4 class="display-2 font-weight-light mb-3 black--text">
              {{ editedItem.name }}
            </h4>
            <h6 class="display-1 mb-1 grey--text">
              <router-link
                :to="'/companies/' + editedItem.company_id"
              >
                {{ companyName }}
              </router-link>
            </h6>
            <h6 class="display-1 mb-1 grey--text">
              VRP Number: {{ editedItem.plan_number }}
            </h6>
            <p class="display-1 font-weight-light grey--text">
              {{ editedItem.description }}
            </p>
            <template>
              <div class="d-inline">
                <v-icon>mdi-map</v-icon>
              </div>
              <div class="d-inline">
                <span
                  class="display-1 mb-1 grey--text"
                >
                  Zone: {{ editedItem.zone_name }}
                </span>
              </div>
              <div
                class="my-3"
              >
                <router-link
                  v-if="editedItem.zone_name !== 'Unknown'"
                  :to="{ path: '/map', query: { vessel: $route.params.id } }"
                >
                  View on Map
                </router-link>
                <span
                  v-else
                  class="grey--text"
                >
                  View on Map
                </span>
              </div>
              <p class="subtitle-1 grey--text mx-auto mt-1">
                {{ timestamp }}
              </p>
            </template>
          </v-card-text>
        </base-material-card>
        <v-speed-dial
          v-if="showAis && role && checkCUD(role.id)"
          v-model="aisFab"
          class="ais-fab"
          direction="bottom"
          transition="slide-y-reverse-transition"
        >
          <template v-slot:activator>
            <v-btn
              color="primary"
              dark
              absolute
              top
              medium
              right
              fab
            >
              <v-icon v-if="aisFab">
                mdi-close
              </v-icon>
              <v-icon v-else>
                mdi-access-point
              </v-icon>
            </v-btn>
          </template>
          <fetch-ais
            :aisrequest="aisrequest"
            @getExtendedAis="getExtendedAis"
            @get:data-from-api="getDataFromApi"
          />
        </v-speed-dial>
      </v-col>
      <v-col
        cols="12"
        md="8"
      >
        <router-view
          :aisdata="extendedAis"
          @getAIS="getAIS"
        />
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
          <v-progress-linear
            v-if="uploadingImage || !!loading"
            indeterminate
          />
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
              mdi-ferry
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
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  color="secondary"
                  icon
                  v-on="on"
                  @click="importPhoto"
                >
                  <v-icon>
                    mdi-auto-fix
                  </v-icon>
                </v-btn>
              </template>
              Import Vessel Photo
            </v-tooltip>
          </template>
          <v-card-text class="text-center">
            <h4 class="display-2 font-weight-light mb-3 black--text">
              {{ editedItem.name }}
            </h4>
            <h6 class="display-1 mb-1 grey--text">
              <router-link
                :to="'/companies/' + editedItem.company_id"
              >
                {{ companyName }}
              </router-link>
            </h6>
            <h6 class="display-1 mb-1 grey--text">
              VRP Number: {{ editedItem.plan_number }}
            </h6>
            <p class="display-1 font-weight-light grey--text">
              {{ editedItem.description }}
            </p>
            <template>
              <div class="d-inline">
                <v-icon>mdi-map</v-icon>
              </div>
              <div class="d-inline">
                <span
                  class="display-1 mb-1 grey--text"
                >
                  Zone: {{ editedItem.zone_name }}
                </span>
              </div>
              <div
                class="my-3"
              >
                <router-link
                  v-if="editedItem.zone_name !== 'Unknown'"
                  :to="{ path: '/map', query: { vessel: $route.params.id } }"
                >
                  View on Map
                </router-link>
                <span
                  v-else
                  class="grey--text"
                >
                  View on Map
                </span>
              </div>
              <p class="subtitle-1 grey--text mx-auto mt-1">
                {{ timestamp }}
              </p>
            </template>
          </v-card-text>
        </base-material-card>
        <fetch-ais
          v-if="showAis && role && checkCUD(role.id)"
          class="hidden-sm-and-down"
          :aisrequest="aisrequest"
          @getExtendedAis="getExtendedAis"
          @get:data-from-api="getDataFromApi"
        />
        <template v-else>
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
              v-model="editedItem.vendor_active"
              class="mt-0 pt-0"
              disabled
              label="Vendor"
            />
            <v-switch
              v-model="editedItem.networks_active"
              class="mt-0 pt-0"
              disabled
              label="Network Membership"
            />
          </base-material-card>
          <base-material-card
            v-if="editedItem.networks_active"
            color="primary"
            title="Network Membership"
            icon="mdi-security-network"
          >
            <v-row class="mb-5" />
            <v-switch
              v-for="networkItem in networkItems"
              :key="networkItem.id"
              v-model="networks"
              :value="networkItem.code"
              class="mt-0 pt-0"
              disabled
              :loading="!!loading"
              :label="networkItem.name"
            />
          </base-material-card>
        </template>
      </v-col>
    </v-row>
    <router-view
      v-else
      :has-photo="editedItem && editedItem.has_photo"
      :company-has-photo="editedItem && editedItem.company_has_photo"
    />
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
  import { companyItemsDownload } from '@/mixins/menuItemsDownload/companyItemsDownload'
  import { checkVesselsTab, checkCUD } from '@/shared/management'

  export default {
    components: {
      ImageCropper: () => import('../../components/ImageCropper'),
      FetchAis: () => import('../../components/FetchAis'),
    },
    mixins: [
      networkItemsDownload,
      companyItemsDownload,
    ],
    data: () => ({
      activeTab: 0,
      editedItem: {},
      aisInfo: {},
      networks: [],
      msgBox: false,
      smff: null,
      zone: null,
      cropper: {
        show: false,
        image: null,
        cnt: 0,
      },
      loading1: false,
      loading: 0,
      uploadingImage: false,
      extendedAis: {},
      aisFab: false,
      aisrequest: {},
      coverPhotoUrl: '',
      checkCUD,
    }),
    computed: {
      ...mapState({
        role: state => state.authentication.role,
      }),
      timestamp () {
        let date = this.extendedAis && Object.keys(this.extendedAis).length && this.extendedAis.position ? this.extendedAis.position.timestamp : this.editedItem.ais_timestamp
        if (!date) return ''
        date = new Date(date.replace(' ', 'T'))
        return date.toDateString() + ', ' + date.toLocaleTimeString() + ', UTC'
        // the original dt is UTC, it's converted to locale time, so converted time is still UTC, not locale
      },
      tabs () {
        if (this.role) return checkVesselsTab(this.role.id).map(tab => ({ ...tab, to: '/vessels/' + this.$route.params.id + '/' + tab.to }))
        else return []
      },
      showRightBar () {
        const path = this.$route.path
        return path.endsWith('general') ||
          path.endsWith('construction') ||
          path.endsWith('ais') ||
          path.endsWith('notes')
      },
      showAis () {
        const path = this.$route.path
        return path.endsWith('ais')
      },
      companyName () {
        return (this.companyItems.find(company =>
          company.id === this.editedItem.company_id,
        ) || {}).name
      },
    },
    watch: {
      $route (to, from) {
        if (to.params.id !== from.params.id) {
          this.getDataFromApi()
        }
      },
    },
    mounted () {
      this.getDataFromApi()
      this.getExtendedAis()
    },
    methods: {
      ...mapActions({
        showSnackBar: 'showSnackBar',
      }),
      getAIS (extended, satellite, pollType, flag) {
        this.aisrequest = { extended, satellite, pollType, flag }
      },
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
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        this.uploadingImage = true
        this.cropper.show = false
        const formData = new FormData()
        formData.append('file_rect', rectImg)
        formData.append('file_sqr', squareImg)
        axios.post(
          `vessels/${this.$route.params.id}/setPhoto`,
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
          this.uploadingImage = false
        }).catch(error => {
          this.showSnackBar({ text: error, color: 'error' })
          this.uploadingImage = false
        })
      },
      getExtendedAis (ais) {
        this.extendedAis = ais
      },
      getDataFromApi () {
        axios.get('vessels/' + this.$route.params.id)
          .then(res => {
            this.editedItem = res.data.data[0]
            if (this.editedItem) {
              this.makeCoverPhotoUrl()
            }
          })
        axios.get('vessels/' + this.$route.params.id + '/smff')
          .then(res => {
            this.smff = res.data.smff
            this.networks = res.data.networks
          })
        axios.get('vessels/' + this.$route.params.id + '/ais')
          .then(res => {
            this.aisInfo = res.data.data[0]
            this.loading1 = false
          })
      },
      toggleStatus () {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        axios.post('vessels/' + this.$route.params.id + '/toggleStatus')
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
          this.loading1 = true
          axios.delete('vessels/' + this.$route.params.id + '/smff')
            .then(res => {
              this.showSnackBar({ text: res.data.message, color: 'success' })
              this.getDataFromApi()
            })
        } else {
          axios.post('vessels/' + this.$route.params.id + '/smff/create')
            .then(res => {
              this.showSnackBar({ text: res.data.message, color: 'success' })
              this.getDataFromApi()
            })
        }
      },
      importPhoto () {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        this.uploadingImage = true
        axios.post('ais/getaisphoto/' + this.editedItem.imo)
          .then(res => {
            if (res.data.success) {
              this.showSnackBar({ text: res.data.message, color: 'success' })
              this.editedItem.has_photo = true
              this.makeCoverPhotoUrl()
            } else {
              this.showSnackBar({ text: res.data.message, color: 'warning' })
            }
          })
          .catch(err => {
            this.showSnackBar({ text: err, color: 'error' })
          })
          .finally(() => {
            this.uploadingImage = false
          })
      },
      makeCoverPhotoUrl () {
        this.coverPhotoUrl = this.editedItem.has_photo
          ? `https://storage.googleapis.com/donjon-smit/pictures/vessels/${this.$route.params.id}/cover_sqr.jpg?${new Date().getTime()}`
          : this.editedItem.company_has_photo
            ? `https://storage.googleapis.com/donjon-smit/pictures/companies/${this.editedItem.company_id}/cover_sqr.jpg`
            : ''
      },
      openNewTab (url) {
        window.open(url, '_blank')
      },
    },
  }
</script>

<style lang="sass">
#vessels-index
  .new-image-link
    cursor: pointer
  .ais-fab
    .v-speed-dial__list
      position: relative
</style>
