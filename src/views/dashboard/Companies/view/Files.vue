<template>
  <v-container class="files-section">
    <v-row>
      <v-col
        cols="12"
        sm="4"
      >
        <base-material-card
          color="secondary"
          :title="companyName"
          class="title-name"
        >
          <v-expansion-panels
            accordion
            flat
          >
            <v-expansion-panel
              v-for="(category, i) in Object.keys(categories)"
              :key="i"
            >
              <v-expansion-panel-header
                class="doc-expansion-header"
              >
                {{ category }}
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row
                  v-for="dir in categories[category]"
                  :key="dir.code"
                >
                  <v-col
                    style="cursor: pointer;"
                    @click="editContent(dir.code)"
                  >
                    {{ `${dir.name} (${dir.count})` }}
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </base-material-card>
      </v-col>
      <v-col
        v-if="directory"
        cols="12"
        sm="8"
      >
        <base-material-card
          color="primary"
          :title="directory.name"
        >
          <v-progress-linear
            v-if="loadingFiles"
            indeterminate
          />
          <v-progress-linear
            v-if="uploadingProgress"
            height="15"
            striped
            color="success"
            :value="uploadingProgress"
          />
          <vue-dropzone
            v-if="role && checkCUD(role.id)"
            id="dropzone1"
            ref="dropzone"
            :options="dropOptions"
            :destroy-dropzone="true"
            @vdropzone-success="fileUploaded"
            @vdropzone-total-upload-progress="checkUploadProgress"
          />
          <v-btn
            v-if="role && checkCUD(role.id) && directory.generated"
            color="secondary"
            class="full-width"
            @click="generateDlg=true"
          >
            Generate New Document
          </v-btn>
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
                  v-if="item.name.slice(item.name.length - 3) === 'pdf'"
                  fab
                  x-small
                  color="success"
                  :href="getDocumentHRef(item)"
                  target="_blank"
                >
                  <v-icon>mdi-eye-check</v-icon>
                </v-btn>
                <v-btn
                  v-else
                  fab
                  x-small
                  color="success"
                  :href="`#/docxviewer?docxUrl=${getDocumentHRef(item)}`"
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
        <v-dialog
          v-model="generateDlg"
          width="500"
        >
          <v-card>
            <v-card-title
              class="headline grey lighten-2"
            >
              New Document
            </v-card-title>
            <v-card-text>
              <v-form
                ref="genDocForm"
                v-model="newDocData.valid"
              >
                <v-text-field
                  v-if="directory.code === 'damage-stability-coverage-certification'"
                  v-model="newDocData.certificateNumber"
                  label="Certificate Number *"
                  prepend-icon="mdi-counter"
                  :rules="[v => !!v || 'Certificate Number is required']"
                />
                <v-text-field
                  v-if="directory.code === 'damage-stability-coverage-certification'"
                  v-model="newDocData.certificateRevision"
                  label="Certificate Revision *"
                  prepend-icon="mdi-counter"
                  :rules="[v => !!v || 'Certificate Revision is required']"
                />
                <v-menu
                  v-model="newDocData.menu"
                  :close-on-content-click="false"
                  transition="scroll-y-transition"
                  min-width="290px"
                  offset-y
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="newDocData.dateIssued"
                      label="Issue Date *"
                      prepend-icon="mdi-calendar"
                      readonly
                      :rules="[v => !!v || 'Issue Date is required']"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="newDocData.dateIssued"
                    color="red"
                    @input="newDocData.menu = false"
                  />
                </v-menu>
                <v-select
                  v-if="directory.hasAddress"
                  v-model="newDocData.address"
                  :items="addressItems"
                  label="Address"
                  prepend-icon="mdi-map-marker"
                  :rules="[v => !!v || 'Address is required']"
                />
                <v-autocomplete
                  v-if="directory.code === 'single-vessel-pre-fire-plan-certification' || directory.code === 'aa-vessel-specific'"
                  v-model="newDocData.vessel"
                  :items="vesselItems"
                  item-text="name"
                  item-value="id"
                  label="Vessel"
                  prepend-icon="mdi-ferry"
                  clearable
                />
                <v-autocomplete
                  v-if="directory.code === 'non-tank-smff-annex'"
                  v-model="newDocData.qi"
                  :items="companyQIItems"
                  item-text="name"
                  item-value="id"
                  label="QI *"
                  prepend-icon="mdi-anchor"
                  clearable
                />
                <v-autocomplete
                  v-if="directory.code === 'non-tank-smff-annex'"
                  v-model="newDocData.dpa"
                  :items="dpaItems"
                  item-text="name"
                  item-value="id"
                  label="DPA Contacts"
                  prepend-icon="mdi-email"
                  multiple
                  clearable
                />
                <v-autocomplete
                  v-if="directory.code === 'non-tank-smff-annex'"
                  v-model="newDocData.contract"
                  :items="contractItems"
                  item-text="name"
                  item-value="name"
                  label="Contract"
                  prepend-icon="mdi-file"
                  clearable
                />
              </v-form>
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-spacer />
              <v-btn
                @click="generateDlg = false"
              >
                Cancel
              </v-btn>
              <v-btn
                color="primary"
                :disabled="!newDocData.valid"
                @click="generateDocument"
              >
                Generate
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
          <v-card-text class="text-center">
            <v-img
              v-if="editedItem && editedItem.has_photo"
              :src="`https://storage.googleapis.com/donjon-smit/pictures/companies/${$route.params.id}/cover_sqr.jpg`"
              class="img-avatar"
            />
            <v-icon
              v-else
              size="100"
              color="grey"
            >
              mdi-domain
            </v-icon>
            <h4 class="display-2 font-weight-light mb-3 black--text">
              {{ editedItem.name }}
            </h4>
            <h6 class="display-1 mb-1 grey--text">
              VRP Number: {{ editedItem.plan_number }}
            </h6>
          </v-card-text>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import axios from 'axios'
  import { companyFiles } from '@/mixins/companyFiles'
  import { mapActions, mapState } from 'vuex'
  import download from 'downloadjs'
  import vueDropzone from 'vue2-dropzone'
  import { makeDocumentFormat } from '../utils'
  import { apiUrl } from '../../../../../config'
  import { checkCUD } from '@/shared/management'

  export default {
    components: { vueDropzone },
    mixins: [companyFiles],
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
        selectedFiles: [],
        removeData: {},
        deleteDisabled: true,
        loading: false,
        loadingFiles: false,
        companyName: '',
        editedItem: {},
        directory: null,
        files: [],
        dropOptions: {
          url: '',
          headers: { Authorization: 'Bearer ' + this.$store.state.authentication.token },
          dictDefaultMessage: '<b>Drag and drop to upload content</b><br/> or click to select a file from your computer.<br/>Maximum 5 files upload at a time. Maximum per file upload size 1024mb.',
          timeout: 18000000,
          maxFilesize: 1024,
          parallelUploads: 5,
        },
        generateDlg: false,
        newDocData: {
          valid: true,
          menu: false,
          dateIssued: new Date().toISOString().substr(0, 10),
        },
        addressItems: [],
        vesselItems: [],
        companyQIItems: [],
        dpaItems: [],
        contractItems: [],
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
          this.$refs.dropzone.setOption('url', `${apiUrl}companies/${this.$route.params.id}/documents/${newVal.code}/upload`)
          this.$refs.dropzone.setOption('headers', { Authorization: 'Bearer ' + this.$store.state.authentication.token })
        } else {
          this.dropOptions.url = `${apiUrl}companies/${this.$route.params.id}/documents/${newVal.code}/upload`
          this.dropOptions.headers = { Authorization: 'Bearer ' + this.$store.state.authentication.token }
        }
      },
    },
    mounted () {
      this.getDataFromApi()
      this.getCompanyDataFromApi()
    },
    methods: {
      ...mapActions({
        showSnackBar: 'showSnackBar',
      }),
      getDocumentHRef (item) {
        return 'https://storage.googleapis.com/donjon-smit/files/Documents/' + this.$route.params.id + '/' + this.directory.code + '/' + item.name
      },
      deleteAll () {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        this.$confirm('Please confirm that you would like to delete the following files?', { title: 'Warning' })
          .then(res => {
            if (res) {
              axios.post(`companies/${this.$route.params.id}/documents/${this.directory.code}/bulkdestroy`, this.selectedFiles)
                .then(res => {
                  this.showSnackBar({ text: res.data.message, color: 'success' })
                  this.getFiles()
                })
            }
          })
      },
      getDataFromApi () {
        axios.get('companies/' + this.$route.params.id)
          .then(res => {
            this.companyName = res.data.data[0].name
          })
        axios.get(`companies/${this.$route.params.id}/documents/count`)
          .then(res => {
            Object.keys(res.data).forEach(key => {
              if (this.getDirFromCode(key)) {
                this.getDirFromCode(key).count = res.data[key].count
              }
            })
          })
      },
      getCompanyDataFromApi () {
        axios.get('companies/' + this.$route.params.id)
          .then(res => {
            this.editedItem = res.data.data[0]
          })
        axios.get('companies/' + this.$route.params.id + '/smff')
          .then(res => {
            this.smff = res.data.smff
          })
      },
      getDocuments (addresses, i) {
        if (addresses.length === 0) return []
        const addressTypes = ['Billing', 'Branches', 'Primary']
        const items = []
        addresses.forEach(address => {
          const addr = makeDocumentFormat(address)
          if (addr) {
            items.push({
              text: addressTypes[i] + ' - ' + addr,
              value: addr,
            })
          }
          if (address.document_format) {
            const documentFormatAddress = address.document_format.replace(/\u21b5/g, '\n') // replace '↵' to '\n'
            items.push({
              text: addressTypes[i] + ' Document Format - ' + documentFormatAddress,
              value: documentFormatAddress,
            })
          }
        })
        return items
      },
      editContent (code) {
        this.directory = this.getDirFromCode(code)
        axios.get(`companies/${this.$route.params.id}/addresses`)
          .then(res => {
            this.addressItems = this.getDocuments(res.data[2].addresses, 2)
              .concat(this.getDocuments(res.data[0].addresses, 0))
              .concat(this.getDocuments(res.data[1].addresses, 1))
          })
        axios.get(`vessels/company/${this.$route.params.id}/index`)
          .then(res => {
            this.vesselItems = res.data.data
          })
        axios.get(`companies/${this.$route.params.id}/qi`)
          .then(res => {
            this.companyQIItems = res.data.data
          })
        axios.get(`companies/${this.$route.params.id}/contacts/dpa`)
          .then(res => {
            this.dpaItems = res.data.data
          })
        axios.get(`companies/${this.$route.params.id}/documents/contracts`)
          .then(res => {
            this.contractItems = res.data
          })
        this.getFiles()
      },
      getFiles () {
        this.loadingFiles = true
        axios.get(`companies/${this.$route.params.id}/documents/${this.directory.code}`)
          .then(res => {
            this.files = res.data.reverse()
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
        this.$refs.dropzone.removeAllFiles()
        this.showSnackBar({ text: res.message, color: 'success' })
        this.getFiles()
      },
      deleteFile (file) {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        this.$confirm(`Please confirm that you would like to delete the following file: <b>${file.name}</b>`, { title: 'Warning' })
          .then(res => {
            if (res) {
              axios.delete(`companies/${this.$route.params.id}/documents/${this.directory.code}/${file.name}/destroy`)
                .then(res => {
                  this.showSnackBar({ text: res.data.message, color: 'success' })
                  this.getFiles()
                })
            }
          })
      },
      downloadFile (file) {
        axios({
          url: `/companies/${this.$route.params.id}/documents/${this.directory.code}/${file.name}/download`,
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
      generateDocument () {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        this.generateDlg = false
        this.newDocData.name = this.companyName
        axios.post(`companies/${this.$route.params.id}/documents/${this.directory.filename}/${this.directory.code}/generateV2`, this.newDocData)
          .then(res => {
            this.showSnackBar({ text: res.data.message, color: 'success' })
            this.getFiles()
            this.getDataFromApi()
          }).catch(error => {
            this.showSnackBar({ text: error, color: 'error' })
            this.getFiles()
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
  .doc-expansion-header
    font-size: 16px !important
  .v-expansion-panel-content
    padding-left: 20px
  .full-width
    width: 100%
</style>
