<template>
  <v-container
    id="adminWorkflow"
    class="fill-height justify-center"
    tag="section"
  >
    <v-app-bar
      absolute
      color="transparent"
      flat
      height="85"
    >
      <v-container class="px-0 text-right d-flex align-center">
        <v-toolbar-title
          class="font-weight-light hidden-xs-only"
        >
          <v-btn
            text
            to="/"
            min-height="48"
            min-width="40"
          >
            {{ title }}
          </v-btn>
        </v-toolbar-title>

        <v-spacer />

        <template v-for="item in profile.children">
          <v-btn
            v-if="item.downloadLink"
            :key="item.id"
            :to="item.to"
            min-height="48"
            min-width="40"
            text
            :href="item.downloadLink"
            download="sample_form_format"
          >
            <v-icon
              :left="$vuetify.breakpoint.mdAndUp"
              size="20"
              v-text="item.icon"
            />

            <span
              class="hidden-sm-and-down"
              v-text="item.text"
            />
          </v-btn>

          <v-btn
            v-else
            :key="item.id"
            :to="item.to"
            min-height="48"
            min-width="40"
            text
          >
            <v-icon
              :left="$vuetify.breakpoint.mdAndUp"
              size="20"
              v-text="item.icon"
            />

            <span
              class="hidden-sm-and-down"
              v-text="item.text"
            />
          </v-btn>
        </template>
      </v-container>
    </v-app-bar>
    <v-row
      align="center"
      class="text-center"
      justify="center"
    >
      <v-progress-linear
        v-if="loading"
        indeterminate
      />
      <v-col
        class="mb-10"
        cols="12"
      >
        <pages-heading>
          Administration Mode
        </pages-heading>

        <div class="display-1 font-weight-light grey--text text--lighten-2">
          Directly update the database via bulk uploads or single entity wizard
        </div>
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <v-select
          v-model="category"
          prepend-icon="mdi-check"
          label="Category"
          :items="categories"
        />
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <v-autocomplete
          v-model="selectedId"
          :items="selectedItems.items"
          item-text="name"
          item-value="id"
          :label="selectedItems.label"
          :prepend-icon="selectedItems.icon"
          clearable
        />
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              v-clipboard:copy="selectedId"
              color="primary"
              v-on="on"
            >
              Copy ID To Clipboard
            </v-btn>
          </template>
          <span>Click to Copy ID</span>
        </v-tooltip>
      </v-col>
      <v-col
        v-for="(plan, i) in plans"
        :key="i"
        class="d-flex"
        cols="12"
        sm="6"
        lg="3"
      >
        <v-card
          :color="!plan.best ? 'transparent elevation-0' : undefined"
          :light="plan.best"
          class="v-card--plan mx-auto pt-3 pb-4 px-2 text-center"
          max-width="280px"
          @click="activeBox(i)"
        >
          <div
            class="body-2 text-uppercase grey--text mb-7"
            v-text="plan.heading"
          />
          <v-progress-linear
            v-if="plan.best && loading"
            indeterminate
          />
          <v-avatar
            size="130"
            :style="!plan.best ? undefined : 'border-color: #00a3e4;'"
          >
            <v-icon
              :color="!plan.best ? undefined : 'primary'"
              size="64"
              v-text="plan.icon"
            />
          </v-avatar>

          <h2
            class="display-2 font-weight-light px-7"
            style="margin: 40px 0;"
            v-text="plan.title"
          />

          <pages-btn
            v-if="!plan.relation"
            :color="!plan.best ? 'white' : 'primary'"
            class="bulk-btn"
            @click="showDialog(plan.heading)"
          >
            Add One
          </pages-btn>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                :color="!plan.best ? 'white' : 'primary'"
                class="bulk-btn"
                v-on="on"
                @click="fileUpload = true, activeBulk = i"
              >
                Add Bulk
              </v-btn>
            </template>
            <span>Add apostrophe (') before + or leading 0 in phone fields.</span>
          </v-tooltip>
        </v-card>
      </v-col>
      <v-col
        class="d-flex"
        cols="12"
        sm="6"
        lg="3"
      >
        <v-card
          :color="!activeDocument ? 'transparent elevation-0' : undefined"
          :light="activeDocument"
          class="v-card--plan mx-auto pt-3 pb-4 px-2 text-center"
          min-width="280px"
          @click="activeDoc"
        >
          <div
            class="body-2 text-uppercase grey--text mb-7"
            v-text="'documents'"
          />

          <v-avatar
            size="130"
            :style="!activeDocument ? undefined : 'border-color: #00a3e4;'"
          >
            <v-icon
              :color="!activeDocument ? undefined : 'primary'"
              size="64"
              v-text="'mdi-file-document'"
            />
          </v-avatar>
          <v-autocomplete
            v-model="company"
            :items="companyItems"
            item-text="name"
            item-value="id"
            label="Companies *"
            :rules="[v => !!v || 'Company is required']"
            return-object
          />
          <v-select
            v-model="companyDocType"
            :items="docType"
            item-text="name"
            item-value="code"
            label="Select the document type *"
            :rules="[v => !!v || 'Select the document type is required']"
            solo
            style="border-radius: 28px; margin-bottom: -20px;"
            return-object
          />
          <v-col>
            <v-avatar
              v-if="fileGenerate"
              size="25"
              class="mt-0"
              :style="!activeDocument? undefined : 'border-color: #00a3e4;'"
            >
              <v-icon
                size="20"
                :style="!fileGenerate && !activeDocument? undefined : 'background-color: transparent; color: #00a3e4;'"
                @click="generateDialog"
                v-text="'mdi-auto-fix'"
              />
            </v-avatar>
            <v-avatar
              v-else
              size="25"
              class="mt-0"
              @click="noClick"
            >
              <v-icon
                size="20"
                :style="!fileGenerate && !activeDocument? undefined : 'background-color: transparent; color: white;'"
                disabled
                v-text="'mdi-auto-fix'"
              />
            </v-avatar>
            <span
              v-if="fileGenerate"
              class="ml-2"
              :style="!activeDocument? undefined : 'color: #00a3e4;'"
              @click="generateDialog"
            >
              Generate Document
            </span>
            <span
              v-else
              class="ml-2"
              style="color: gray;"
              @click="noClick"
            >
              Generate Document
            </span>
          </v-col>
          <v-file-input
            v-if="upload"
            ref="file"
            type="file"
            color="deep-purple accent-4"
            label="File input"
            placeholder="Select your files"
            prepend-icon="mdi-paperclip"
            outlined
            :display-size="1000"
            class="file-input"
            @change="uploadFiles"
          />
          <v-file-input
            v-else
            ref="file"
            type="file"
            color="deep-purple accent-4"
            label="File input"
            placeholder="Select your files"
            prepend-icon="mdi-paperclip"
            outlined
            :display-size="1000"
            class="file-input"
            disabled
          />
        </v-card>
      </v-col>
    </v-row>
    <v-dialog
      v-model="fileUpload"
      max-width="500"
    >
      <v-card>
        <v-card-title class="headline">
          Add Bulk Data
        </v-card-title>
        <v-file-input
          v-model="bulkFiles"
          label="File input"
          placeholder="Select your files"
          outlined
          class="file-input pa-5"
        />
        <v-card-actions class="pr-5 pb-5">
          <v-spacer />
          <v-btn
            color="primary"
            @click="fileUpload = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="sendFile(activeBulk)"
          >
            Add Data
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="showAddOne"
      max-width="700"
      @click:outside="closeAdd"
      @keydown.esc="closeAdd"
    >
      <add-individual
        v-if="showDlg === 'Individuals'"
        :counter="addCounter"
        @complete="completeAdd"
      />
      <add-company
        v-if="showDlg === 'Companies'"
        :counter="addCounter"
        @complete="completeAdd"
      />
      <add-vessel
        v-if="showDlg === 'Vessels'"
        :counter="addCounter"
        @complete="completeAdd"
      />
    </v-dialog>
    <v-dialog
      v-model="generateDlg"
      width="500"
      @click:outside="closeNewDoc"
      @keydown.esc="closeNewDoc"
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
              v-if="companyDocType.code === 'damage-stability-coverage-certification'"
              v-model="newDocData.certificateNumber"
              label="Certificate Number *"
              prepend-icon="mdi-counter"
              :rules="[v => !!v || 'Certificate Number is required']"
            />
            <v-text-field
              v-if="companyDocType.code === 'damage-stability-coverage-certification'"
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
              v-if="companyDocType.hasAddress"
              v-model="newDocData.address"
              :items="addressItems"
              label="Address"
              prepend-icon="mdi-map-marker"
              :rules="[v => !!v || 'Address is required']"
            />
            <v-autocomplete
              v-if="companyDocType.code === 'single-vessel-pre-fire-plan-certification' || companyDocType.code === 'aa-vessel-specific'"
              v-model="newDocData.vessel"
              :items="vesselItems"
              item-text="name"
              item-value="id"
              label="Vessel"
              prepend-icon="mdi-ferry"
              clearable
            />
            <v-autocomplete
              v-if="companyDocType.code === 'nt-smff-annex'"
              v-model="newDocData.qi"
              :items="companyQIItems"
              item-text="name"
              item-value="id"
              label="QI *"
              prepend-icon="mdi-anchor"
              clearable
            />
            <v-autocomplete
              v-if="companyDocType.code === 'nt-smff-annex'"
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
              v-if="companyDocType.code === 'nt-smff-annex'"
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
            @click="closeNewDoc"
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
    <v-dialog
      v-model="confirmDialog"
      max-width="700"
    >
      <v-card>
        <v-card-title>
          <v-spacer />
          <v-icon
            size="25"
            @click="confirmDialog = false"
          >
            mdi-close
          </v-icon>
        </v-card-title>
        <v-divider class="mt-5 mb-5" />
        <v-card-actions
          v-for="(fileName, i) in generateFileNames"
          :key="i"
          class="ml-5 pb-5"
        >
          <v-row class="no-gutters">
            <v-col
              cols="9"
            >
              <span>{{ fileName.name }}</span>
            </v-col>
            <v-col
              cols="3"
              class="d-flex justify-end"
            >
              <v-btn
                v-if="fileName.name.slice(fileName.name.length - 3) === 'pdf'"
                fab
                x-small
                color="success"
                class="mr-2"
                :href="getDocumentHRef(fileName.name)"
                target="_blank"
              >
                <v-icon>mdi-eye-check</v-icon>
              </v-btn>
              <v-btn
                v-else
                fab
                x-small
                color="success"
                class="mr-2"
                :href="`#/docxviewer?docxUrl=${getDocumentHRef(fileName.name)}`"
                target="_blank"
              >
                <v-icon>mdi-eye-check</v-icon>
              </v-btn>
              <v-btn
                fab
                x-small
                color="primary"
                class="mr-2"
                @click="downloadFile(fileName)"
              >
                <v-icon>mdi-cloud-download</v-icon>
              </v-btn>
              <v-btn
                fab
                x-small
                color="error"
                class="mr-2"
                @click="deleteFile(fileName)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import axios from 'axios'
  import { mapActions } from 'vuex'
  import { makeDocumentFormat } from '../dashboard/Companies/utils'
  import download from 'downloadjs'
  import { countryItemsDownload } from '@/mixins/menuItemsDownload/countryItemsDownload'
  import { companyItemsDownload } from '@/mixins/menuItemsDownload/companyItemsDownload'
  import { vesselTypeItemsDownload } from '@/mixins/menuItemsDownload/vesselTypeItemsDownload'
  import { societyItemsDownload } from '@/mixins/menuItemsDownload/societyItemsDownload'
  import { piItemsDownload } from '@/mixins/menuItemsDownload/piItemsDownload'
  import { insurerItemsDownload } from '@/mixins/menuItemsDownload/insurerItemsDownload'
  import { providerItemsDownload } from '@/mixins/menuItemsDownload/providerItemsDownload'
  import { OIL_GROUP } from '@/shared/constants'

  export default {
    components: {
      PagesHeading: () => import('./components/Heading'),
      PagesBtn: () => import('./components/Btn'),
      AddIndividual: () => import('../dashboard/components/forms/AddIndividual'),
      AddVessel: () => import('../dashboard/components/forms/AddVessel'),
      AddCompany: () => import('../dashboard/components/forms/AddCompany'),
    },

    mixins: [
      countryItemsDownload,
      companyItemsDownload,
      vesselTypeItemsDownload,
      societyItemsDownload,
      piItemsDownload,
      insurerItemsDownload,
      providerItemsDownload,
    ],

    data: () => ({
      activeDocument: false,
      titles: {
        '/admin-workflow': 'Donjon-SMIT Portal',
      },
      fileUpload: false,
      bulkFiles: [],
      files: {},
      showAddOne: false,
      addCounter: 0,
      showDlg: null,
      company: null,
      companyDocType: {},
      some: {},
      fileGenerate: false,
      upload: false,
      generateDlg: false,
      confirmDialog: false,
      generateFileNames: [],
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
      plans: [
        {
          best: true,
          heading: 'Companies',
          icon: 'mdi-domain',
          title: 'Add one company or bulk add multiple companies.',
        },
        {
          best: false,
          heading: 'Vessels',
          icon: 'mdi-ferry',
          title: 'Add one vessel or bulk add multiple vessels',
        },
        {
          best: false,
          heading: 'Individuals',
          icon: 'mdi-account-multiple',
          title: 'Add one individual or bulk add multiple individuals.',
        },
        {
          best: false,
          heading: 'Vessel Relations',
          icon: 'mdi-bookmark-plus-outline',
          title: 'Bulk Add Relations of Vessels (Leads and Childs)',
          relation: true,
        },
      ],
      docType: [
        { header: 'Schedule A' },
        {
          name: 'SCHEDULE A Non-Tank',
          code: 'schedule-a-non-tank',
          count: 0,
          generated: true,
          hasAddress: false,
        },
        {
          name: 'SCHEDULE A Tanker',
          code: 'schedule-a-tanker',
          count: 0,
          generated: true,
          hasAddress: false,
        },
        {
          name: 'SCHEDULE A Combined',
          code: 'schedule-a-combined',
          count: 0,
          generated: true,
          hasAddress: false,
        },
        { header: 'Pre-fire Plan Certification' },
        {
          name: 'Multiple Vessels Pre-fire Plan Certification',
          code: 'multiple-vessels-pre-fire-plan-certification',
          count: 0,
          generated: true,
          hasAddress: true,
        },
        {
          name: 'Single Vessel Pre-fire Plan Certification',
          code: 'single-vessel-pre-fire-plan-certification',
          count: 0,
          generated: true,
          hasAddress: true,
        },
        { header: 'SMFF Coverage Certification' },
        {
          name: 'SMFF Coverage Certification',
          code: 'smff-coverage-certification',
          count: 0,
          generated: true,
          hasAddress: false,
        },
        { header: 'Contracts, Written Consents, and Agreements' },
        {
          name: 'Written Consent Agreement - Group V',
          code: 'written-consent-agreement-group-v',
          count: 0,
          generated: true,
          hasAddress: true,
        },
        {
          name: 'Written Consent Agreement - Non Tank Vessels below 250 bbls',
          code: 'written-consent-agreement-non-tank-vessels-below-250-bbls',
          count: 0,
          generated: true,
          hasAddress: true,
        },
        {
          name: 'Written Consent Agreement - Non Tank Vessels below 2500 bbls',
          code: 'written-consent-agreement-non-tank-vessels-below-2500-bbls',
          count: 0,
          generated: true,
          hasAddress: true,
        },
        {
          name: 'OPA-90 Client Contract',
          code: 'contracts',
          count: 0,
          generated: false,
          hasAddress: false,
        },
        {
          name: 'OPA-90 Response Asset Agreement',
          code: 'opa-90-response-asset-agreement',
          count: 0,
          generated: false,
          hasAddress: false,
        },
        {
          name: 'NASA Response Asset Agreement',
          code: 'nasa-response-asset-agreement',
          count: 0,
          generated: false,
          hasAddress: false,
        },
        { header: 'Annex' },
        {
          name: 'Tank SMFF Annex',
          code: 'tank-smff-annex',
          count: 0,
          generated: false,
          hasAddress: false,
        },
        {
          name: 'Non-Tank SMFF Annex',
          code: 'nt-smff-annex',
          count: 0,
          generated: false,
          hasAddress: false,
        },
        {
          name: 'Combined SMFF Annex',
          code: 'combined-smff-annex',
          count: 0,
          generated: false,
          hasAddress: false,
        },
        {
          name: 'AA-Vessel Specific Page',
          code: 'aa-vessel-specific',
          count: 0,
          generated: true,
          hasAddress: false,
        },
        { header: 'Damage Stability' },
        {
          name: 'Damage Stability Coverage Certification',
          code: 'damage-stability-coverage-certification',
          count: 0,
          generated: false,
          hasAddress: false,
        },
        { header: 'Shipboard Spill Mitigation Procedures' },
        {
          name: 'Shipboard Spill Mitigation Procedures',
          code: 'shipboard-spill-mitigation-procedures',
          count: 0,
          generated: false,
          hasAddress: false,
        },
      ],
      categories: [
        { text: 'Company Name', value: 'company_name' },
        { text: 'Country Name', value: 'country_name' },
        { text: 'Vessel Type', value: 'vessel_type' },
        { text: 'Class', value: 'class' },
        { text: 'P&I Club', value: 'pi_club' },
        { text: 'H&M Insurer', value: 'hm_insurer' },
        { text: 'Oil Group', value: 'oil_group' },
        { text: 'Damage Stability', value: 'damage_stability' },
      ],
      category: 'company_name',
      selectedId: 0,
    }),
    computed: {
      title () {
        return this.titles[this.$route.path]
      },
      selectedItems () {
        const items = [
          { category: 'company_name', items: this.companyItems, label: 'Company Name', icon: 'mdi-domain' },
          { category: 'country_name', items: this.countryItems, label: 'Country Name', icon: 'mdi-map-marker' },
          { category: 'vessel_type', items: this.vesselTypeItems, label: 'Vessel Type', icon: 'mdi-tag' },
          { category: 'class', items: this.societyItems, label: 'Class', icon: 'mdi-axis-arrow-lock' },
          { category: 'pi_club', items: this.piItems, label: 'P&I Club', icon: 'mdi-umbrella' },
          { category: 'hm_insurer', items: this.insurerItems, label: 'H&M Insurer', icon: 'mdi-engine' },
          { category: 'oil_group', items: OIL_GROUP.map(oil => ({ id: oil, name: oil })), label: 'Oil Group', icon: 'mdi-oil' },
          { category: 'damage_stability', items: this.providerItems, label: 'Damage Stability', icon: 'mdi-chart-bell-curve' },
        ]

        return items.find(item => item.category === this.category)
      },
      profile () {
        return {
          children: [
            {
              id: 1,
              icon: 'mdi-view-dashboard',
              text: 'Dashboard',
              to: '/',
            },
            {
              id: 2,
              icon: 'mdi-cloud-download',
              text: 'Bulk Upload Templates',
              downloadLink: require('@/assets/bulk_upload_templates_v1.4.zip'),
            },
            {
              id: 3,
              icon: 'mdi-shield-account',
              text: 'My Profile',
              to: '/individuals/' + this.$store.state.authentication.user.id + '/general',
            },
            {
              id: 4,
              icon: 'mdi-lock-open-outline',
              text: 'Lock',
              to: '/pages/lock',
            },
          ],
        }
      },
    },
    watch: {
      companyDocType () {
        if (this.company && this.companyDocType.generated) {
          this.fileGenerate = true
        } else {
          this.fileGenerate = false
        }
        if (this.company && this.companyDocType.code) {
          this.upload = true
        } else {
          this.upload = false
        }
      },
      company () {
        if (this.company && this.companyDocType.generated) {
          this.fileGenerate = true
        } else {
          this.fileGenerate = false
        }
        if (this.company && this.companyDocType.code) {
          this.upload = true
        } else {
          this.upload = false
        }
      },
    },
    methods: {
      ...mapActions({
        showSnackBar: 'showSnackBar',
      }),
      getDocumentHRef (name) {
        return 'https://storage.googleapis.com/donjon-smit/files/Documents/' + this.company.id + '/' + this.companyDocType.code + '/' + name
      },
      activeBox (k) {
        let i = 0
        for (i = 0; i < this.plans.length; i++) {
          this.plans[i].best = false
        }
        this.activeDocument = false
        this.plans[k].best = true
      },
      activeDoc () {
        let i = 0
        for (i = 0; i < this.plans.length; i++) {
          this.plans[i].best = false
        }
        this.activeDocument = true
      },
      async sendFile (activeBulk) {
        this.loading++
        this.fileUpload = false
        const urls = [
          'companies/upload/bulkCsv',
          'vessels/upload/bulkCsv',
          'users/upload/bulkCsv',
          'vessels/upload/bulkRelations',
        ]
        const apiUrl = urls[activeBulk]
        const formData = new FormData()
        formData.append('file', this.bulkFiles)
        try {
          const response = await axios.post(apiUrl, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
          this.showSnackBar({ text: response.data.message, color: response.data.success })
          this.loading--
        } catch (err) {
          this.showSnackBar({ text: err, color: 'error' })
          this.loading--
        }
      },
      showDialog (showDlg) {
        this.showDlg = showDlg
        this.$vuetify.theme.dark = false
        this.showAddOne = true
        this.addCounter++
      },
      generateDialog () {
        this.$vuetify.theme.dark = false
        this.editContent()
        this.generateDlg = true
      },
      completeAdd (success) {
        this.$vuetify.theme.dark = true
        this.showAddOne = false
      },
      closeAdd () {
        this.$confirm('Do you want to lose your progress?', { title: 'Warning' })
          .then(res => {
            this.$vuetify.theme.dark = true
            if (!res) {
              this.$vuetify.theme.dark = false
              this.showAdd = true
            }
          })
      },
      closeNewDoc () {
        this.$vuetify.theme.dark = true
        this.generateDlg = false
      },
      generateDocument () {
        this.generateDlg = false
        this.$vuetify.theme.dark = true
        this.newDocData.name = this.company.name
        axios.post(`companies/${this.company.id}/documents/${this.companyDocType.code}/generateV2`, this.newDocData)
          .then(res => {
            this.getFiles()
          }).catch(error => {
            this.showSnackBar({ text: error, color: 'error' })
            this.getFiles()
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
          if (address.document_format && !(['null', 'undefined'].includes(address.document_format.toLowerCase()))) {
            items.push({
              text: addressTypes[i] + ' Document Format - ' + address.document_format,
              value: address.document_format,
            })
          }
        })
        return items
      },
      editContent () {
        axios.get(`companies/${this.company.id}/addresses`)
          .then(res => {
            this.addressItems = this.getDocuments(res.data[2].addresses, 2)
              .concat(this.getDocuments(res.data[0].addresses, 0))
              .concat(this.getDocuments(res.data[1].addresses, 1))
          })
        axios.get(`vessels/company/${this.company.id}/index`)
          .then(res => {
            this.vesselItems = res.data.data
          })
        axios.get(`companies/${this.company.id}/qi`)
          .then(res => {
            this.companyQIItems = res.data.data
          })
        axios.get(`companies/${this.company.id}/contacts/dpa`)
          .then(res => {
            this.dpaItems = res.data.data
          })
        axios.get(`companies/${this.company.id}/documents/contracts`)
          .then(res => {
            this.contractItems = res.data
          })
      },
      getFiles () {
        axios.get(`companies/${this.company.id}/documents/${this.companyDocType.code}`)
          .then(res => {
            this.generateFileNames[0] = res.data[res.data.length - 2]
            this.generateFileNames[1] = res.data[res.data.length - 1]
            this.confirmDialog = true
            this.showSnackBar({ text: 'File generated', color: 'success' })
          })
      },
      uploadFiles () {
        const formData = new FormData()
        formData.append('file', event.target.files[0])
        axios.post(`companies/${this.company.id}/documents/${this.companyDocType.code}/upload`, formData).then(res => {
          this.generateFileNames[0] = res.data
          this.showSnackBar({ text: res.data.message, color: 'success' })
          this.confirmDialog = true
        }).catch(error => {
          this.showSnackBar({ text: error.response.data.message || error.response.data.statusText, color: 'error' })
        })
      },
      noClick () {
        this.showSnackBar({ text: 'File type is upload only.', color: 'error' })
      },
      downloadFile (file) {
        axios({
          url: `/companies/${this.company.id}/documents/${this.companyDocType.code}/${file.name}/download`,
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
      deleteFile (file) {
        this.$confirm(`Please confirm that you would like to delete the following file: <b>${file.name}</b>`, { title: 'Warning' })
          .then(res => {
            if (res) {
              axios.delete(`companies/${this.company.id}/documents/${this.companyDocType.code}/${file.name}/destroy`)
                .then(res => {
                  this.showSnackBar({ text: res.data.message, color: 'success' })
                })
            }
          })
      },
    },
  }
</script>

<style lang="sass">
  .v-card--plan
    .v-avatar
      border-radius: 50%
      border: 1px solid #E5E5E5
  .company-btn
    margin: 5px
    width: 170px
    height:36px
    border-radius: 28px
  .bulk-btn
    margin: 5px
    width: 110px
    height:36px
    border-radius: 28px
</style>
