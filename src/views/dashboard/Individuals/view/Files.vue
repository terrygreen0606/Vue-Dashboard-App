<template>
  <v-container
    id="individual-files"
    class="individual-document files-section"
  >
    <v-row>
      <v-col
        cols="12"
        sm="4"
      >
        <base-material-card
          color="secondary"
          :title="user.first_name + ' ' + user.last_name"
          class="title-name"
        >
          <v-progress-linear
            v-if="loading"
            indeterminate
          />
          <v-expansion-panels
            accordion
            flat
          >
            <v-expansion-panel
              v-for="(section, i) in sections"
              :key="i"
            >
              <v-expansion-panel-header
                class="doc-expansion-header"
                @click="getFiles(section)"
              >
                {{ section.title }}
              </v-expansion-panel-header>
            </v-expansion-panel>
          </v-expansion-panels>
        </base-material-card>
      </v-col>
      <v-col
        v-if="directory.title"
        cols="12"
        sm="8"
      >
        <base-material-card
          color="primary"
          :title="user.first_name + ' ' + user.last_name + ' - ' + directory.title"
        >
          <v-progress-linear
            v-if="loadingFile"
            indeterminate
          />
          <v-progress-linear
            v-if="uploadingProgress"
            :value="uploadingProgress"
            height="15"
            striped
            color="success"
          />
          <vue-dropzone
            v-if="role && checkCUD(role.id)"
            :id="directory.code"
            ref="dropzone"
            :options="dropOptions"
            :destroy-dropzone="true"
            @vdropzone-success="fileUploaded"
            @vdropzone-total-upload-progress="checkUploadProgress"
          />
          <v-data-table
            v-model="selectedFiles"
            :headers="headers"
            :items="files"
            item-key="name"
            show-select
          >
            <template
              v-slot:[`item.name`]="{item}"
            >
              <v-icon
                color="secondary"
                size="24"
              >
                {{ getIconFromExt(item.ext) }}
              </v-icon>
              {{ item.name }}
            </template>
            <template
              v-slot:[`item.ext`]="{item}"
            >
              <v-speed-dial
                v-model="fab[item.name]"
                direction="left"
              >
                <template v-slot:activator>
                  <v-btn
                    v-model="fab[item.name]"
                    fab
                    small
                    color="primary"
                  >
                    <v-icon v-if="fab[item.name]">
                      mdi-close
                    </v-icon>
                    <v-icon v-else>
                      mdi-chevron-left
                    </v-icon>
                  </v-btn>
                </template>
                <v-btn
                  fab
                  x-small
                  color="primary"
                  @click="downloadFile(item)"
                >
                  <v-icon>mdi-cloud-download</v-icon>
                </v-btn>
                <v-btn
                  fab
                  x-small
                  color="error"
                  @click="deleteFile(item)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-btn
                  fab
                  x-small
                  color="success"
                  :href="'https://storage.googleapis.com/donjon-smit/users/' + $route.params.id + '/Documents/' + directory.code + '/' + item.name"
                  target="_blank"
                >
                  <v-icon>mdi-eye-check</v-icon>
                </v-btn>
              </v-speed-dial>
            </template>
          </v-data-table>
          <v-btn
            color="error"
            :disabled="deleteDisabled"
            class="offset-8"
            @click="deleteAll"
          >
            delete
          </v-btn>
        </base-material-card>
      </v-col>
      <v-col
        v-else
        cols="12"
        sm="8"
      >
        <base-material-card
          color="primary"
          title="Document Generation and Upload"
          class="title-name"
        >
          <v-progress-linear
            v-if="loading"
            indeterminate
          />
          <v-card-text class="text-center">
            <v-img
              v-if="user && user.has_photo"
              :src="`https://storage.googleapis.com/donjon-smit/pictures/individuals/${$route.params.id}/cover_sqr.jpg`"
              class="img-avatar"
            />
            <v-img
              v-else-if="user && user.primary_company && user.primary_company.has_photo"
              :src="`https://storage.googleapis.com/donjon-smit/pictures/companies/${user.primary_company_id}/cover_sqr.jpg`"
              class="img-avatar"
            />
            <v-icon
              v-else
              size="100"
              color="grey"
            >
              mdi-account
            </v-icon>
            <h4 class="display-2 font-weight-light mb-3 black--text">
              {{ user.first_name }} {{ user.last_name }}
            </h4>
            <h4 class="display-1 font-weight-light mb-3 black--text">
              {{ companyName }}
            </h4>
          </v-card-text>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import axios from 'axios'
  import { mapActions, mapState } from 'vuex'
  import download from 'downloadjs'
  import vueDropzone from 'vue2-dropzone'
  import { apiUrl } from '../../../../../config'
  import { checkCUD } from '@/shared/management'

  export default {
    components: { vueDropzone },
    data () {
      return {
        headers: [
          {
            text: 'File Name',
            value: 'name',
          },
          {
            text: 'File Size',
            value: 'size',
          },
          {
            text: 'Actions',
            value: 'ext',
            sortable: false,
          },
        ],
        sections: [
          {
            title: 'Certifications & Qualifications',
            code: 'cq',
          },
          {
            title: 'Invoices',
            code: 'invoices',
          },
          {
            title: 'Resume/CV',
            code: 'cv',
          },
          {
            title: 'Training',
            code: 'training',
          },
        ],
        selectedFiles: [],
        deleteDisabled: true,
        loading: false,
        loadingFile: false,
        directory: {
          title: null,
          code: null,
        },
        files: [],
        user: {},
        companyName: '',
        dropOptions: {
          url: '',
          headers: { Authorization: 'Bearer ' + this.$store.state.authentication.token },
          dictDefaultMessage: '<b>Drag and drop to upload content</b><br/> or click to select a file from your computer.<br/>Maximum 5 files upload at a time. Maximum per file upload size 1024mb.',
          timeout: 18000000,
          maxFilesize: 1024,
          parallelUploads: 5,
        },
        fab: {},
        uploadingProgress: 0,
        checkCUD,
      }
    },
    computed: {
      ...mapState({
        role: state => state.authentication.role,
      }),
      computedHeaders () {
        return this.headers
      },
    },
    watch: {
      $route (to, from) {
        if (to.params.id !== from.params.id) {
          this.getDataFromApi()
        }
      },
      selectedFiles () {
        if (this.selectedFiles.length > 0) {
          this.deleteDisabled = false
        } else {
          this.deleteDisabled = true
        }
      },
      directory (newVal, oldVal) {
        if (this.$refs.dropzone) {
          this.$refs.dropzone.setOption('url', `${apiUrl}users/${this.$route.params.id}/files/documents/${newVal.code}/upload`)
          this.$refs.dropzone.setOption('headers', { Authorization: 'Bearer ' + this.$store.state.authentication.token })
        } else {
          this.dropOptions.url = `${apiUrl}users/${this.$route.params.id}/files/documents/${newVal.code}/upload`
          this.dropOptions.headers = { Authorization: 'Bearer ' + this.$store.state.authentication.token }
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
      deleteAll () {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        this.$confirm('Please confirm that you would like to delete the following files?', { title: 'Warning' })
          .then(res => {
            if (res) {
              axios.post(`users/${this.$route.params.id}/files/documents/${this.directory.code}/bulkdestroy`, this.selectedFiles)
                .then(res => {
                  this.loadingFiles = true
                  this.showSnackBar({ text: res.data.message, color: 'success' })
                  axios.get(`users/${this.$route.params.id}/files/documents/${this.directory.code}`)
                    .then(res => {
                      this.files = res.data
                      this.loadingFiles = false
                    })
                })
            }
          })
      },
      getDataFromApi () {
        this.loading = true
        axios.get('users/' + this.$route.params.id)
          .then(res => {
            this.companyName = res.data.data[0].primary_company && res.data.data[0].primary_company.name
            this.user = res.data.data[0]
            this.loading = false
          })
      },
      getFiles (section) {
        this.loadingFiles = true
        this.directory = section
        axios.get(`users/${this.$route.params.id}/files/documents/${this.directory.code}`)
          .then(res => {
            this.files = res.data
            this.loadingFiles = false
          })
      },
      getIconFromExt (ext) {
        if (ext === 'pdf') {
          return 'mdi-file-pdf'
        } else if (ext === 'docx') {
          return 'mdi-file-document'
        } else if (ext === 'png') {
          return 'mdi-file-image'
        }
        return 'mdi-file'
      },
      fileUploaded (file, res) {
        this.loadingFiles = true
        this.$refs.dropzone.removeAllFiles()
        this.showSnackBar({ text: res.message, color: 'success' })
        axios.get(`users/${this.$route.params.id}/files/documents/${this.directory.code}`)
          .then(res => {
            this.files = res.data
            this.loadingFiles = false
          })
      },
      deleteFile (file) {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        this.$confirm(`Please confirm that you would like to delete the following file: <b>${file.name}</b>`, { title: 'Warning' })
          .then(res => {
            if (res) {
              axios.delete(`users/${this.$route.params.id}/files/documents/${this.directory.code}/${file.name}/destroy`)
                .then(res => {
                  this.loadingFiles = true
                  this.showSnackBar({ text: res.data.message, color: 'success' })
                  axios.get(`users/${this.$route.params.id}/files/documents/${this.directory.code}`)
                    .then(res => {
                      this.files = res.data
                      this.loadingFiles = false
                    })
                })
            }
          })
      },
      downloadFile (file) {
        axios({
          url: `users/${this.$route.params.id}/files/documents/${this.directory.code}/${file.name}/download`,
          method: 'GET',
          responseType: 'blob',
          timeout: 18000000,
        }).then(downloadRes => {
          this.showSnackBar({ text: 'Download started', color: 'success' })
          download(downloadRes.data, file.name)
        }).catch(error => {
          this.showSnackBar({ text: error, color: 'error' })
        })
      },
      checkUploadProgress (progress) {
        this.uploadingProgress = progress
        if (progress === 100) {
          this.uploadingProgress = 0
        }
      },
    },
  }
</script>

<style lang="sass">
#individual-files
  .doc-expansion-header
    font-size: 16px !important
  .v-expansion-panel-header__icon
    display: none
  .v-expansion-panel-content
    padding-left: 20px
  .full-width
    width: 100%
</style>
