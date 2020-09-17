<template>
  <div class="files-section">
    <base-material-card
      color="primary"
      :title="title"
    >
      <v-progress-linear
        v-if="loading"
        indeterminate
      />
      <vue-dropzone
        id="dropzone1"
        ref="dropzone"
        :options="dropOptions"
        :destroy-dropzone="true"
        @vdropzone-success="fileUploaded"
      />
      <v-data-table
        :headers="headers"
        :items="files"
      >
        <template v-slot:item="file">
          <tr>
            <td>
              <v-icon
                color="secondary"
                size="24"
              >
                {{ getIconFromExt(file.item.ext) }}
              </v-icon>
              {{ file.item.name }}
            </td>
            <td>
              {{ file.item.size }}
            </td>
            <td>
              <v-speed-dial
                v-model="fab[file.item.name]"
                direction="left"
              >
                <template v-slot:activator>
                  <v-btn
                    v-model="fab[file.item.name]"
                    fab
                    small
                    color="primary"
                  >
                    <v-icon v-if="fab[file.item.name]">
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
                  @click="downloadFile(file.item)"
                >
                  <v-icon>mdi-cloud-download</v-icon>
                </v-btn>
                <v-btn
                  fab
                  x-small
                  color="error"
                  @click="deleteFile(file.item)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-speed-dial>
            </td>
          </tr>
        </template>
      </v-data-table>
    </base-material-card>
  </div>
</template>

<script>
  import axios from 'axios'
  import { mapActions } from 'vuex'
  import vueDropzone from 'vue2-dropzone'
  import download from 'downloadjs'

  export default {
    components: { vueDropzone },
    props: {
      title: String,
      url: String,
    },
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
            value: 'actions',
          },
        ],
        loading: false,
        directory: {},
        files: [],
        dropOptions: {
          url: `https://dev-cdt-api.httpsolutions.com/api/${this.url}/upload`,
          headers: { Authorization: 'Bearer ' + this.$store.state.authentication.token },
          dictDefaultMessage: '<b>Drag and drop to upload content</b><br/> or click to select a file from your computer.<br/>Maximum 5 files upload at a time. Maximum per file upload size 1024mb.',
          timeout: 18000000,
          parallelUploads: 5,
        },
        fab: {},
      }
    },
    mounted () {
      this.getFiles()
    },
    methods: {
      ...mapActions({
        showSnackBar: 'showSnackBar',
      }),
      getFiles () {
        this.loading = true
        axios.get(this.url)
          .then(res => {
            this.files = res.data
            this.loading = false
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
        this.$confirm(`Please confirm that you would like to delete the following file: <b>${file.name}</b>`, { title: 'Warning' })
          .then(res => {
            if (res) {
              axios.delete(`${this.url}/${file.name}/destroy`)
                .then(res => {
                  this.showSnackBar({ text: res.data.message, color: 'success' })
                  this.getFiles()
                })
            }
          })
      },
      downloadFile (file) {
        axios({
          url: `${this.url}/${file.name}/download`,
          method: 'GET',
          responseType: 'blob',
          timeout: 30000,
        }).then(downloadRes => {
          this.showSnackBar({ text: 'Download started', color: 'success' })
          download(downloadRes.data, file.name)
        }).catch(error => {
          this.showSnackBar({ text: error, color: 'error' })
        })
      },
    },
  }
</script>
