<template>
  <div>
    <base-material-card
      color="primary"
      title="Notes"
    >
      <v-progress-linear
        v-if="loading"
        indeterminate
      />
      <v-card-text>
        <v-card
          v-for="note in notes"
          :key="note.id"
        >
          <v-card-title>
            {{ note.user }} - {{ note.created_at }}
            <v-spacer />
            <v-btn
              icon
              @click="deleteNote(note.id)"
            >
              <v-icon color="error">
                mdi-delete
              </v-icon>
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-card-text>
            {{ note.note }}
          </v-card-text>
        </v-card>
        <base-material-alert
          v-if="!notes || !notes.length"
          color="warning"
          dark
        >
          No notes defined
        </base-material-alert>
        <v-dialog
          v-model="addMsg"
          max-width="500"
        >
          <template v-slot:activator="{ on }">
            <v-btn
              color="primary"
              v-on="on"
            >
              Add Note
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="headline">
              New Note
            </v-card-title>
            <v-card-text>
              <v-textarea
                v-model="newNote.note"
                label="Note *"
                :rules="[v => !!v || 'Note is required']"
              />
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-spacer />
              <v-btn
                @click="addMsg = false"
              >
                Cancel
              </v-btn>
              <v-btn
                color="primary"
                @click="addNote"
              >
                Add Note
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card-text>
    </base-material-card>
  </div>
</template>

<script>
  import axios from 'axios'
  import { mapActions, mapState } from 'vuex'
  import { checkCUD } from '@/shared/management'

  export default {
    data: () => ({
      loading: false,
      notes: [],
      newNote: {
        note_type: 1,
      },
      addMsg: false,
    }),
    computed: {
      ...mapState({
        role: state => state.authentication.role,
      }),
    },
    mounted () {
      this.getDataFromApi()
    },
    methods: {
      ...mapActions({
        showSnackBar: 'showSnackBar',
      }),
      getDataFromApi () {
        this.loading = true
        axios.get('companies/' + this.$route.params.id + '/notes')
          .then(res => {
            this.notes = res.data.data
            this.loading = false
          })
      },
      addNote () {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        if (this.newNote.note) {
          axios.post(`companies/${this.$route.params.id}/addNote`, this.newNote)
            .then(res => {
              this.addMsg = false
              this.showSnackBar({ text: res.data.message, color: 'success' })
              this.getDataFromApi()
            }).catch(error => {
              if (error.response && error.response.data) {
                this.showSnackBar({ text: error.response.data.message || error.response.statusText, color: 'error' })
              }
            })
        }
      },
      deleteNote (id) {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        this.$confirm('Please confirm that you would like to delete the note', {
          title: 'Warning',
          buttonTrueText: 'Delete',
          buttonFalseText: 'Cancel',
          buttonTrueColor: 'error',
          buttonFalseColor: 'primary',
        })
          .then(res => {
            if (res) {
              axios.delete('companies/' + this.$route.params.id + '/notes/' + id + '/destroy')
                .then(res => {
                  this.showSnackBar({ text: res.data.message, color: 'success' })
                  this.getDataFromApi()
                })
            }
          })
      },
    },
  }
</script>
