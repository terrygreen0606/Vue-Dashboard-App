<template>
  <base-material-card
    icon="mdi-update"
    title="DB Changes"
    color="primary"
  >
    <v-row
      justify="end"
      class="mb-3"
    >
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            color="primary"
            class="px-1"
            fab
            small
            :loading="loadingAll"
            @click="exportToPdf"
            v-on="on"
          >
            <v-icon>mdi-file-pdf-outline</v-icon>
          </v-btn>
        </template>
        <span>Export Full Report to PDF</span>
      </v-tooltip>
      <download-csv
        :data="totalItems"
        name="DB Changes.csv"
      >
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              color="secondary"
              class="px-1"
              fab
              small
              :loading="loadingAll"
              v-on="on"
            >
              <v-icon>mdi-microsoft-excel</v-icon>
            </v-btn>
          </template>
          <span>Export Full Report to CSV</span>
        </v-tooltip>
      </download-csv>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            color="warning"
            class="px-1"
            fab
            small
            @click="emailDlg = true"
            v-on="on"
          >
            <v-icon>mdi-email</v-icon>
          </v-btn>
        </template>
        <span>Email Full Report</span>
      </v-tooltip>
    </v-row>
    <v-row>
      <v-col
        md="4"
        cols="12"
      >
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="dates"
          transition="scale-transition"
          offset-y
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="dateRangeText"
              label="WHEN"
              prepend-icon="mdi-calendar"
              readonly
              v-on="on"
            />
          </template>
          <v-date-picker
            v-model="dates"
            no-title
            range
            color="primary"
            class="datepicker-width"
          >
            <v-spacer />
            <v-btn
              text
              @click="menu = false"
            >
              Cancel
            </v-btn>
            <v-btn
              text
              @click="$refs.menu.save(dates); getDataFromApi()"
            >
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col
        md="4"
        cols="12"
      >
        <v-select
          v-model="tableName"
          prepend-icon="mdi-update"
          label="WHAT"
          :items="tableNames"
          item-value="id"
          item-text="name"
          :loading="preparing"
          @change="getDataFromApi"
        />
      </v-col>
      <v-col
        md="4"
        cols="12"
      >
        <v-select
          v-model="action"
          prepend-icon="mdi-update"
          label="IS DONE"
          clearable
          :items="actions"
          item-value="id"
          item-text="name"
          :loading="preparing"
          @change="getDataFromApi"
        />
      </v-col>
    </v-row>
    <v-progress-linear
      v-if="loading"
      indeterminate
    />
    <v-data-table
      :headers="headers"
      :items="items"
      :server-items-length="total"
      :options.sync="options"
      :hide-default-footer="true"
    >
      <template v-slot:item.action="{item}">
        <v-chip
          :color="getActionColor(item.action)"
          label
        >
          {{ item.action.toUpperCase() }}
        </v-chip>
      </template>
    </v-data-table>
    <table-footer
      :options="options"
      :total="total"
    />
    <v-dialog
      v-model="emailDlg"
      max-width="600"
    >
      <v-card class="text-center">
        <v-card-title>
          Select Users to Send
          <v-spacer />

          <v-icon
            aria-label="Close"
            @click="productDlg = false"
          >
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <v-autocomplete
            v-model="user_ids"
            :items="users"
            :loading="fetchingUsers"
            hide-no-data
            hide-selected
            item-text="name"
            item-value="id"
            clearable
            multiple
            label="Select Users *"
            prepend-icon="mdi-account"
            :rules="[empty]"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="success"
            type="submit"
            :loading="sending"
          >
            Email Full Report
          </v-btn>
          <v-btn
            color="error"
            type="button"
            @click="emailDlg = false, user_ids = []"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </base-material-card>
</template>

<script>
  import axios from 'axios'
  import { mapActions } from 'vuex'
  import * as JSPDF from 'jspdf'
  import 'jspdf-autotable'

  export default {
    components: {
      TableFooter: () => import('../components/TableFooter'),
      DownloadCsv: () => import('vue-json-csv'),
    },
    data: () => ({
      empty: value => value.length ? true : 'This field is required.',
      menu: false,
      dates: [],
      action: 0,
      actions: [],
      tableName: 1,
      tableNames: [],
      userHeaders: [
        { text: 'Name', value: 'name' },
        { text: 'Company', value: 'company' },
        { text: 'Date', value: 'date' },
        { text: 'Action', value: 'action', sortable: false },
      ],
      vesselHeaders: [
        { text: 'Name', value: 'name' },
        { text: 'IMO', value: 'imo' },
        { text: 'Official Number', value: 'official_number' },
        { text: 'Date', value: 'date' },
        { text: 'Action', value: 'action', sortable: false },
      ],
      companyHeaders: [
        { text: 'Name', value: 'name' },
        { text: 'Plan Number', value: 'plan_number' },
        { text: 'Date', value: 'date' },
        { text: 'Action', value: 'action', sortable: false },
      ],
      items: [],
      totalItems: [],
      total: 0,
      preparing: false,
      loading: false,
      loadingAll: false,
      options: {},
      emailDlg: false,
      user_ids: [],
      sending: false,
      fetchingUsers: false,
      users: [],
    }),

    computed: {
      dateRangeText () {
        return this.dates.slice().sort().join(' ~ ')
      },

      headers () {
        if (this.tableName === 1) return this.userHeaders
        else if (this.tableName === 2) return this.vesselHeaders
        else return this.companyHeaders
      },
    },

    watch: {
      options: {
        handler () {
          this.getDataFromApi()
        },
        deep: true,
      },
    },

    mounted () {
      this.prepareFilters()
      this.fetchAllEntries()
      this.getUsers()
    },

    methods: {
      ...mapActions({
        showSnackBar: 'showSnackBar',
      }),

      async prepareFilters () {
        this.preparing = true
        try {
          const tableNames = await axios.get('reports/changedtables')
          this.tableNames = tableNames.data.map(table => ({ id: table.id, name: table.name.toUpperCase() }))
          const actions = await axios.get('reports/actions')
          this.actions = actions.data.map(action => ({ id: action.id, name: action.name.toUpperCase() }))
        } catch (err) {
          this.showSnackBar({ text: err, color: 'error' })
        }
        this.preparing = false
      },

      async getDataFromApi () {
        this.loading = true
        try {
          const { sortBy, sortDesc, page, itemsPerPage } = this.options
          let apiUrl = `reports/trackreport?page=${page}&per_page=${itemsPerPage}`
          if (sortBy[0]) {
            const direction = sortDesc[0] ? 'desc' : 'asc'
            apiUrl += `&direction=${direction}&sortBy=${sortBy[0]}`
          }
          const request = { changed_table_name_id: this.tableName, action_id: this.action, dates: this.dates }
          const response = await axios.post(apiUrl, request)
          this.total = response.data.total
          this.items = response.data.data
        } catch (err) {
          this.showSnackBar({ text: err, color: 'error' })
        }
        this.loading = false
      },

      async fetchAllEntries () {
        this.loadingAll = true
        try {
          const response = await axios.get('reports/exporttrackreport')
          this.totalItems = response.data
        } catch (err) {
          this.showSnackBar({ text: err, color: 'error' })
        }
        this.loadingAll = false
      },

      async getUsers () {
        this.fetchingUsers = true
        try {
          const users = await axios.get('getAllUsersName')
          this.users = users.data.users
        } catch (err) {
          this.showSnackBar({ text: err, color: 'error' })
        }
        this.fetchingUsers = false
      },

      exportToPdf () {
        const columns = this.headers.map(header => ({ title: header.text, dataKey: header.value }))
        const pdf = new JSPDF()
        pdf.autoTable(columns, this.totalItems, { theme: 'grid' })
        pdf.save('DB Changes.pdf')
      },

      getActionColor (actionName) {
        const colors = { 1: 'primary', 2: 'error', 3: 'warning', 4: 'success', 5: 'secondary' }
        const action = this.actions.find(action => action.name === actionName.toUpperCase())
        if (action) {
          return colors[action.id]
        }
      },
    },
  }
</script>
