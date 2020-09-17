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
    <v-row v-if="!showFiles">
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
              mdi-account
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
              {{ editedItem.first_name }} {{ editedItem.last_name }}
            </h4>
            <h6
              v-if="editedItem.primary_company_id"
              class="display-1 mb-1 grey--text"
            >
              <router-link
                v-if="editedItem.primary_company"
                :to="'/companies/' + editedItem.primary_company_id"
              >
                {{ editedItem.primary_company.name }}
              </router-link>
              <p v-else>
                No Company Assigned
              </p>
            </h6>
            <p class="display-1 font-weight-light grey--text">
              {{ editedItem.description }}
            </p>
            <v-btn
              v-if="editedItem.resume_link"
              color="primary"
              class="mt-1"
              rounded
              :href="'https://storage.googleapis.com/donjon-smit/users/' + editedItem.id + '/Documents/cv/' + editedItem.resume_link"
              target="_blank"
            >
              CV
            </v-btn>
          </v-card-text>
        </base-material-card>
      </v-col>
      <v-col
        cols="12"
        md="8"
      >
        <router-view @refetchData="refetchData" />
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
              mdi-account
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
              {{ editedItem.first_name }} {{ editedItem.last_name }}
            </h4>
            <h6
              v-if="editedItem.primary_company_id"
              class="display-1 mb-1 grey--text"
            >
              <router-link
                v-if="editedItem.primary_company"
                :to="'/companies/' + editedItem.primary_company_id"
              >
                {{ editedItem.primary_company.name }}
              </router-link>
              <p v-else>
                No Company Assigned
              </p>
            </h6>
            <p class="display-1 font-weight-light grey--text">
              {{ editedItem.description }}
            </p>
            <v-btn
              v-if="editedItem.resume_link"
              color="primary"
              class="mt-1"
              rounded
              :href="'https://storage.googleapis.com/donjon-smit/users/' + editedItem.id + '/Documents/cv/' + editedItem.resume_link"
              target="_blank"
            >
              CV
            </v-btn>
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
                  v-if="editedItem.active"
                  color="success"
                  size="30"
                >
                  mdi-shield-account
                </v-icon>
                <v-icon
                  v-else
                  color="error"
                  size="30"
                >
                  mdi-shield-account
                </v-icon>
              </span>
            </v-badge>
          </div>
          <v-switch
            v-model="editedItem.active"
            label="Active"
            @click.stop="toggleStatus"
          />
          <v-switch
            v-model="smff"
            label="Capabilities"
            class="mt-0 pt-0"
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
          icon="mdi-security-network"
          title="Network Membership"
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
      </v-col>
    </v-row>
    <router-view v-else />
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
  import { checkIndividualsTab, checkCUD, adminDutyNasa } from '@/shared/management'

  export default {
    components: {
      ImageCropper: () => import('../../components/ImageCropper'),
    },
    mixins: [
      networkItemsDownload,
    ],
    data: () => ({
      activeTab: 0,
      editedItem: {},
      networks: [],
      msgBox: false,
      smff: null,
      cropper: {
        show: false,
        image: null,
        cnt: 0,
      },
      loading: 0,
      coverPhotoUrl: '',
    }),
    computed: {
      ...mapState({
        networkItems: state => state.menuitems.networkItems,
        role: state => state.authentication.role,
        user: state => state.authentication.user,
      }),
      tabs () {
        if (this.role) return checkIndividualsTab(this.role.id).map(tab => ({ ...tab, to: '/individuals/' + this.$route.params.id + '/' + tab.to }))
        else return []
      },
      showFiles () {
        const path = this.$route.path
        return path.endsWith('files') ||
          path.endsWith('smff')
      },
    },
    watch: {
      user: {
        handler (user) {
          if (Object.keys(user).length && user.id !== parseInt(this.$route.params.id)) {
            if (!adminDutyNasa(this.role.id)) {
              this.$router.push('/')
            }
          }
        },
        deep: true,
        immediate: true,
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
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        this.cropper.show = false
        const formData = new FormData()
        formData.append('file_rect', rectImg)
        formData.append('file_sqr', squareImg)
        axios.post(
          `users/${this.$route.params.id}/setPhoto`,
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
        axios.get('users/' + this.$route.params.id)
          .then(res => {
            this.editedItem = res.data.data[0]
            this.makeCoverPhotoUrl()
          })
        axios.get('users/' + this.$route.params.id + '/smff')
          .then(res => {
            this.smff = res.data.smff
            this.networks = res.data.networks
          })
      },
      toggleStatus () {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        axios.post('users/' + this.$route.params.id + '/toggleStatus')
          .then(res => {
            this.showSnackBar({ text: res.data.message, color: 'success' })
            this.getDataFromApi()
          }).catch(error => {
            this.showSnackBar({ text: error.response.data.message || error.response.statusText, color: 'error' })
          })
      },
      toggleSMFF () {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        if (this.smff) {
          axios.delete('users/' + this.$route.params.id + '/smff')
            .then(res => {
              this.showSnackBar({ text: res.data.message, color: 'success' })
              this.getDataFromApi()
            })
        } else {
          axios.post('users/' + this.$route.params.id + '/smff/create')
            .then(res => {
              this.showSnackBar({ text: res.data.message, color: 'success' })
              this.getDataFromApi()
            })
        }
      },
      refetchData (val) {
        val && this.getDataFromApi()
      },
      makeCoverPhotoUrl () {
        this.coverPhotoUrl = this.editedItem.has_photo
          ? `https://storage.googleapis.com/donjon-smit/pictures/individuals/${this.$route.params.id}/cover_sqr.jpg?${new Date().getTime()}`
          : this.editedItem.primary_company && this.editedItem.primary_company.has_photo
            ? `https://storage.googleapis.com/donjon-smit/pictures/companies/${this.editedItem.primary_company_id}/cover_sqr.jpg`
            : ''
      },
      openNewTab (url) {
        window.open(url, '_blank')
      },
    },
  }
</script>

<style lang="sass">
.new-image-link
  cursor: pointer
</style>
