<template>
  <base-material-card
    icon="mdi-ferry"
    title="Active Vessels"
    color="primary"
  >
    <v-progress-linear
      v-if="loading"
      indeterminate
    />
    <v-row
      justify="end"
      class="my-3"
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
        name="Active Vessels.csv"
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
    <v-data-table
      :headers="headers"
      :items="items"
      :options.sync="options"
      :hide-default-footer="true"
      :server-items-length="total"
    >
      <template v-slot:item.country="{item}">
        <flag
          :iso="item.country"
          :squared="false"
        />
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
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'IMO', value: 'imo' },
        { text: 'MMSI', value: 'mmsi' },
        { text: 'H & M', value: 'hm' },
        { text: 'DPA', value: 'dpa' },
        { text: 'Email', value: 'dpa_email' },
        { text: 'Work Phone', value: 'dpa_work_phone' },
        { text: 'Phone', value: 'dpa_mobile_phone' },
        { text: 'AOH Phone', value: 'dpa_aoh_phone' },
        { text: 'Fax', value: 'dpa_fax' },
        { text: 'Company', value: 'company' },
        { text: 'Country', value: 'country' },
      ],
      items: [],
      loading: false,
      options: {},
      total: 0,
      totalItems: [],
      loadingAll: false,
      emailDlg: false,
      user_ids: [],
      sending: false,
      fetchingUsers: false,
      users: [],
    }),

    watch: {
      options: {
        handler () {
          this.getDataFromApi()
        },
        deep: true,
      },
    },

    mounted () {
      this.fetchAllEntries()
      this.getUsers()
    },

    methods: {
      ...mapActions({
        showSnackBar: 'showSnackBar',
      }),

      async getDataFromApi () {
        this.loading = true
        const { sortBy, sortDesc, page, itemsPerPage } = this.options
        try {
          let apiUrl = `reports/donjon/vessels?page=${page}&per_page=${itemsPerPage}`
          if (sortBy[0]) {
            const direction = sortDesc[0] ? 'desc' : 'asc'
            apiUrl += `&direction=${direction}&sortBy=${sortBy[0]}`
          }
          const response = await axios.post(apiUrl)
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
          const response = await axios.get('reports/exportactivevessel')
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
        const filtered = ['mmsi', 'dpa_mobile_phone', 'dpa_aoh_phone', 'dpa_fax']
        const columns = this.headers.filter(header => !filtered.includes(header.value)).map(header => ({ title: header.text, dataKey: header.value }))
        const pdf = new JSPDF()
        // Remove filtered key/values
        filtered.forEach(deleting => {
          delete this.totalItems.deleting
        })
        pdf.autoTable(columns, this.totalItems, { theme: 'grid' })
        pdf.save('Active Vessels.pdf')
      },
    },
  }
</script>
