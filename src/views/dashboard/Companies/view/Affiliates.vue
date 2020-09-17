<template>
  <base-material-card
    color="primary"
    :title="companyName ? `${companyName} - Affiliates` : 'Affiliates'"
  >
    <v-progress-linear
      v-if="!!loading"
      indeterminate
    />
    <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      class="ml-auto"
      label="Search"
      hide-details
      single-line
      clearable
      style="max-width: 250px;"
    />
    <v-data-table
      :headers="computedHeaders"
      :items="companies"
      :options.sync="options"
      :hide-default-footer="true"
      class="mt-5"
    >
      <template v-slot:item="company">
        <tr>
          <td class="pl-5">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <span
                  dark
                  v-on="on"
                >
                  <v-badge
                    slot="activator"
                    left
                    :color="company.item.vrp_status === 'Authorized' ? 'success' : company.item.vrp_status === 'Not Authorized' ? 'error' : 'warning'"
                  >
                    <template v-slot:badge>
                      <v-icon dark>
                        {{ company.item.vrp_status === 'Authorized' ? 'mdi-check' : company.item.vrp_status === 'Not Authorized' ? 'mdi-close' : 'mdi-link' }}
                      </v-icon>
                    </template>
                    <span
                      class="table-link"
                      @click="editCompany(company.item)"
                    >
                      {{ company.item.name | truncate(42) }}
                    </span>
                  </v-badge>
                </span>
              </template>
              <span>{{ company.item.vrp_status }}</span>
            </v-tooltip>
          </td>
          <td>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <span
                  dark
                  v-on="on"
                >
                  <v-badge
                    slot="activator"
                    right
                    :color="company.item.vrp_stats.plan_type==='Tank' ? 'black' : 'blue'"
                    :value="company.item.vrp_stats.plan_type==='Tank' || company.item.vrp_stats.plan_type==='Non-Tank'"
                  >
                    <template v-slot:badge>
                      <v-icon dark>
                        {{ company.item.vrp_stats.plan_type==='Tank' ? 'mdi-water' : 'mdi-water-off' }}
                      </v-icon>
                    </template>
                    <span>
                      {{ company.item.plan_number }}
                    </span>
                  </v-badge>
                </span>
              </template>
              <span>{{ company.item.vrp_stats.plan_type }}</span>
            </v-tooltip>
          </td>
          <td>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <span
                  dark
                  v-on="on"
                >
                  <v-badge
                    slot="activator"
                    bottom
                    bordered
                    overlap
                    color="orange"
                    :value="company.item.response===1"
                  >
                    <template v-slot:badge>
                      <v-icon dark>mdi-star</v-icon>
                    </template>
                    <span>
                      <v-icon
                        v-if="company.item.coverage===1"
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
                </span>
              </template>
              <span v-if="company.item.coverage===1">DJS Coverage</span>
              <span v-else>No DJS Coverage</span>
              <span v-if="company.item.response===1"> and Responder</span>
            </v-tooltip>
          </td>
          <td>{{ company.item.stats.individuals }}</td>
          <td>{{ company.item.stats.vessels }}</td>
          <td>{{ company.item.vrp_stats.vessels }}</td>
          <td>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <span
                  dark
                  v-on="on"
                >
                  <flag
                    :iso="company.item.location.length === 2 ? company.item.location : company.item.country"
                    :squared="false"
                  />
                </span>
              </template>
              <span>{{ getCountryFromCode(company) }}</span>
            </v-tooltip>
          </td>
          <td>
            <v-speed-dial
              v-model="fab[company.item.id]"
              direction="left"
            >
              <template v-slot:activator>
                <v-btn
                  v-model="fab[company.item.id]"
                  fab
                  small
                  color="primary"
                >
                  <v-icon v-if="fab[company.item.id]">
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
                :to="`/companies/${company.item.id}`"
              >
                <v-icon>mdi-eye</v-icon>
              </v-btn>
              <v-btn
                fab
                x-small
                color="error"
                @click="deleteMsg = true, companyToDelete = company.item"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-speed-dial>
          </td>
        </tr>
      </template>
    </v-data-table>
    <table-footer
      v-if="options.itemsPerPage > 0"
      :options="options"
      :total="total"
      :company="true"
    />
    <v-dialog
      v-model="deleteMsg"
      persistent
      max-width="600"
    >
      <v-card>
        <v-card-title class="headline">
          You are about to delete or unlink a company
        </v-card-title>
        <v-card-text>
          Please confirm that you would like to delete or unlink the following company: <b>{{ companyToDelete.name }}</b>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="warning"
            text
            @click="removeLink(companyToDelete.id)"
          >
            Remove Link
          </v-btn>
          <v-btn
            color="error"
            text
            @click="deleteCompany(companyToDelete.id)"
          >
            Delete Company
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="deleteMsg = false"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </base-material-card>
</template>

<script>
  import axios from 'axios'
  import { mapActions, mapState } from 'vuex'
  import { countryItemsDownload } from '@/mixins/menuItemsDownload/countryItemsDownload'
  import { checkCUD } from '@/shared/management'

  export default {
    components: {
      TableFooter: () => import('../../components/TableFooter'),
    },
    mixins: [
      countryItemsDownload,
    ],
    data: () => ({
      search: '',
      headers: [
        {
          text: 'Company',
          value: 'name',
        },
        {
          text: 'Plan',
          value: 'plan_number',
        },
        {
          text: 'Status',
          value: 'djs_coverage',
          sortable: false,
        },
        {
          text: 'Individuals',
          value: 'individuals',
        },
        {
          text: 'DJS Vessels',
          value: 'djs_vessels',
        },
        {
          text: 'VRP Vessels',
          value: 'vrp_vessels',
        },
        {
          text: 'Country',
          value: 'country',
          sortable: false,
        },
        {
          text: 'Actions',
          value: '',
          sortable: false,
        },
      ],
      companies: [],
      loading: 0,
      options: {},
      staticSearch: {
        active: -1,
        resource_provider: -1,
        vrp_status: -1,
        networks: [],
        merge: -1,
      },
      total: 0,
      searchTimeout: null,
      deleteMsg: false,
      companyToDelete: {
        id: -1,
        name: '',
      },
      fab: {},
      companyName: '',
      call: null, // used to stop previous axios request
    }),
    computed: {
      computedHeaders () {
        return this.headers
      },
      ...mapState({
        role: state => state.authentication.role,
      }),
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
      this.staticSearch.parent = this.$route.params.id
      axios.get(`companies/${this.$route.params.id}`)
        .then(res => {
          this.companyName = res.data.data[0].name
        })
      await this.getDataFromApi()
    },
    methods: {
      ...mapActions({
        showSnackBar: 'showSnackBar',
      }),
      getCountryFromCode (company) {
        const code = company.item.location.length === 2 ? company.item.location : company.item.country
        return (this.countryItems.find(v => v.id === code) || {}).name
      },
      async getDataFromApi () {
        this.loading++
        const { sortBy, sortDesc, page, itemsPerPage } = this.options
        try {
          // if have preivous call, cancel it
          if (this.call) {
            this.call.cancel()
            this.loading--
          }

          // create a new call
          this.call = axios.CancelToken.source()

          if (this.search) {
            const res = await axios.post(
              `companies?query=${this.search.replace('&', '%26')}&page=${page}&per_page=${itemsPerPage}`,
              { staticSearch: this.staticSearch },
              { cancelToken: this.call.token },
            )
            this.call = null
            this.companies = res.data.data
            this.total = res.data.meta ? res.data.meta.total : res.data.total
          }
          if (sortBy[0] && !this.search) {
            const direction = sortDesc[0] ? 'desc' : 'asc'
            const res = await axios.post(
              `companies?direction=${direction}&sortBy=${sortBy[0]}&page=${page}&per_page=${itemsPerPage}`,
              { staticSearch: this.staticSearch },
              { cancelToken: this.call.token },
            )
            this.call = null
            this.companies = res.data.data
            this.total = res.data.meta ? res.data.meta.total : res.data.total
          }
          if (!this.search && !sortBy[0]) {
            const res = await axios.post(
              `companies?page=${page}&per_page=${itemsPerPage}`,
              { staticSearch: this.staticSearch },
              { cancelToken: this.call.token },
            )
            this.call = null
            this.companies = res.data.data
            this.total = res.data.meta ? res.data.meta.total : res.data.total
          }
          this.loading--
        } catch (error) {
          if (!axios.isCancel(error)) {
            this.showSnackBar({ text: error, color: 'error' })
          }
        }
      },
      removeLink (id) {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        axios.get('companies/' + id + '/unlinkCompanies')
          .then(res => {
            this.showSnackBar({ text: res.data.message, color: 'success' })
            this.getDataFromApi()
            this.deleteMsg = false
          })
      },
      deleteCompany (id) {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        axios.delete('companies/' + id + '/destroy')
          .then(res => {
            this.showSnackBar({ text: res.data.message, color: 'success' })
            this.getDataFromApi()
            this.deleteMsg = false
          })
      },
    },
  }
</script>
