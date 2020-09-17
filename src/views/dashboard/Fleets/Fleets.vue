<template>
  <v-container
    fluid
    tag="section"
  >
    <base-material-card
      color="primary"
      icon="mdi-anchor"
      inline
    >
      <template v-slot:after-heading>
        <div class="display-2">
          Fleets
        </div>
      </template>

      <v-row align="end">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          class="ml-auto mr-3"
          label="Search"
          hide-details
          single-line
          clearable
          style="max-width: 160px;"
        />
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              color="warning"
              small
              class="mr-2"
              v-on="on"
              @click="addFleet = true"
            >
              <v-icon size="28">
                mdi-plus-circle-outline
              </v-icon>
            </v-btn>
          </template>
          <span>Add Fleet</span>
        </v-tooltip>
      </v-row>
      <v-data-table
        :headers="computedHeaders"
        :items="fleets"
        :options.sync="options"
        :loading="loading"
        :hide-default-footer="true"
        class="mt-5"
      >
        <template v-slot:item="fleet">
          <tr>
            <td>
              <router-link
                class="table-link"
                :to="'/fleets/' + fleet.item.id"
              >
                {{ fleet.item.name | truncate(42) }}
              </router-link>
            </td>
            <td>
              <span>{{ fleet.item.vessels_count }}</span>
            </td>
            <td>
              <v-speed-dial
                v-model="fab[fleet.item.id]"
                direction="left"
              >
                <template v-slot:activator>
                  <v-btn
                    v-model="fab[fleet.item.id]"
                    fab
                    small
                    color="primary"
                  >
                    <v-icon v-if="fab[fleet.item.id]">
                      mdi-close
                    </v-icon>
                    <v-icon v-else>
                      mdi-chevron-left
                    </v-icon>
                  </v-btn>
                </template>
                <v-tooltip
                  bottom
                >
                  <template v-slot:activator="{ on }">
                    <span
                      dark
                      v-on="on"
                    >
                      <v-btn
                        fab
                        x-small
                        color="error"
                        @click="deleteFleet(fleet.item.id)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </span>
                  </template>
                  <span>Remove Fleet</span>
                </v-tooltip>
                <v-tooltip
                  bottom
                >
                  <template v-slot:activator="{ on }">
                    <span
                      dark
                      v-on="on"
                    >
                      <router-link
                        class="table-link"
                        :to="'/fleets/' + fleet.item.id"
                      >
                        <v-btn
                          fab
                          x-small
                          color="success"
                        >
                          <v-icon>mdi-eye-check</v-icon>
                        </v-btn>
                      </router-link>
                    </span>
                  </template>
                  <span>View Fleet</span>
                </v-tooltip>
                <v-tooltip
                  bottom
                >
                  <template v-slot:activator="{ on }">
                    <span
                      dark
                      v-on="on"
                    >
                      <v-btn
                        fab
                        x-small
                        color="warning"
                        @click="changeFleet=true, changeContent = fleet.item"
                      >
                        <v-icon>mdi-rename-box</v-icon>
                      </v-btn>
                    </span>
                  </template>
                  <span>Rename Fleet</span>
                </v-tooltip>
              </v-speed-dial>
            </td>
          </tr>
        </template>
      </v-data-table>
      <table-footer
        :options="options"
        :total="total"
      />
    </base-material-card>
    <v-dialog
      v-model="addFleet"
      max-width="500"
    >
      <v-card>
        <v-card-title class="headline">
          New Fleet
        </v-card-title>
        <v-divider />
        <v-text-field
          v-model="newFleetData.name"
          color="secondary"
          label="Add New Fleet Name"
          prepend-icon="mdi-anchor"
          class="mt-10 mr-5 ml-5 mb-5"
        />
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="error"
            @click="addFleet = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="success"
            @click="addNewFleet"
          >
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="changeFleet"
      max-width="500"
    >
      <v-card>
        <v-card-title class="headline">
          Change Fleet
        </v-card-title>
        <v-divider />
        <v-text-field
          v-model="changeContent.name"
          color="secondary"
          label="Change Fleet Name"
          prepend-icon="mdi-anchor"
          class="mt-10 mr-5 ml-5 mb-5"
        />
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="error"
            @click="changeFleet = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="success"
            @click="changeFleetName"
          >
            Change
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import axios from 'axios'
  import { mapActions, mapState } from 'vuex'
  import { checkCUD } from '@/shared/management'

  export default {
    components: {
      TableFooter: () => import('../components/TableFooter'),
    },
    data: () => ({
      search: '',
      headers: [
        {
          text: 'Name',
          value: 'name',
        },
        {
          text: 'Vessels',
          value: 'vessels',
        },
        {
          text: 'Actions',
          value: 'ext',
          sortable: false,
        },
      ],
      staticSearch: {
        internal: -1,
      },
      fleets: [],
      total: 0,
      options: {},
      loading: false,
      searchTimeout: null,
      addFleet: false,
      changeFleet: false,
      fab: {},
      changeContent: {
        id: 0,
        name: null,
      },
      newFleetData: {},
      updateFleetData: {},
      call: null, // used to stop previous axios request
    }),
    computed: {
      ...mapState({
        role: state => state.authentication.role,
      }),
      computedHeaders () {
        return this.headers
      },
    },
    watch: {
      options: {
        handler () {
          this.getDataFromApi()
        },
        deep: true,
      },
      search () {
        if (this.searchTimeout) {
          clearTimeout(this.searchTimeout)
        }
        this.searchTimeout = setTimeout(() => {
          this.options.page = 1
          this.getDataFromApi()
        }, 500)
      },
    },
    async mounted () {
      await this.getDataFromApi()
    },
    methods: {
      ...mapActions({
        showSnackBar: 'showSnackBar',
      }),
      async getDataFromApi () {
        this.loading = true
        const { sortBy, sortDesc, itemsPerPage } = this.options
        try {
          // if have preivous call, cancel it
          if (this.call) {
            this.call.cancel()
          }

          // create a new call
          this.call = axios.CancelToken.source()

          if (this.search) {
            const res = await axios.post('fleets', { staticSearch: this.staticSearch, query: this.search, per_page: itemsPerPage })
            this.fleets = res.data.data
            this.total = res.data.meta.total
          }

          if (sortBy[0] && !this.search) {
            const direction = sortDesc[0] ? 'desc' : 'asc'
            const res = await axios.post('fleets', { staticSearch: this.staticSearch, direction, sortBy: sortBy[0], per_page: itemsPerPage })
            this.fleets = res.data.data
            this.total = res.data.meta.total
          }
          if (!this.search && !sortBy[0]) {
            const res = await axios.post('fleets', { staticSearch: this.staticSearch, per_page: itemsPerPage })
            this.fleets = res.data.data
            this.total = res.data.meta.total
          }
          this.call = null
        } catch (error) {
          this.showSnackBar({
            text: error,
            color: 'error',
          })
        }
        this.loading = false
      },
      addNewFleet () {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        this.newFleetData = {
          name: this.newFleetData.name,
        }
        axios.post('fleets/create', this.newFleetData)
          .then(res => {
            this.addFleet = false
            this.showSnackBar({ text: res.data.message, color: 'success' })
            this.getDataFromApi()
          }).catch(error => {
            if (error.response && error.response.data) {
              this.showSnackBar({ text: error.response.data.message || error.response.statusText, color: 'error' })
            }
          })
      },
      changeFleetName () {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        this.updateFleetData = {
          name: this.changeContent.name,
        }
        axios.post('fleets/' + this.changeContent.id, this.updateFleetData)
          .then(res => {
            this.changeFleet = false
            this.showSnackBar({ text: res.data.message, color: 'success' })
            this.getDataFromApi()
          }).catch(error => {
            if (error.response && error.response.data) {
              this.showSnackBar({ text: error.response.data.message || error.response.statusText, color: 'error' })
            }
          })
      },
      deleteFleet (id) {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        this.$confirm('Are you sure you want to delete this fleet?', {
          title: 'Warning',
          buttonTrueText: 'Yes',
          buttonFalseText: 'No',
          buttonTrueColor: 'error',
          buttonFalseColor: 'primary',
        })
          .then(res => {
            if (res) {
              axios.delete('fleets/' + id + '/destroy')
                .then(res => {
                  this.showSnackBar({ text: res.data.message, color: 'success' })
                  this.getDataFromApi()
                }).catch(error => {
                  if (error.response && error.response.data) {
                    this.showSnackBar({ text: error.response.data.message || error.response.statusText, color: 'error' })
                  }
                })
            }
          })
      },
    },
  }
</script>
