<template>
  <base-material-card
    color="primary"
  >
    <v-progress-linear
      v-if="loading"
      indeterminate
    />
    <template v-slot:heading>
      <div class="display-1 font-weight-light">
        VRP Express Information (Imported)
      </div>

      <div class="subtitle-1 font-weight-light">
        Plan number must be entered under General tab
      </div>
    </template>
    <v-card-text v-if="planHolder">
      <v-row>
        <v-col
          v-for="(item, i) in fieldData"
          :key="i"
          cols="12"
          sm="6"
        >
          <v-text-field
            v-model="planHolder[item.att]"
            :label="item.label"
            readonly
          />
        </v-col>
      </v-row>
      <v-expansion-panels
        accordion
        flat
      >
        <v-expansion-panel>
          <v-expansion-panel-header
            class="display-2 secondary--text"
          >
            Plan Holder Address
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row>
              <v-col
                v-for="(item, i) in fieldData1"
                :key="i"
                cols="12"
                sm="6"
              >
                <v-text-field
                  v-model="planHolder[item.att]"
                  :label="item.label"
                  readonly
                />
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
    <v-card-text v-else>
      <base-material-alert
        color="warning"
        dark
      >
        No VRP Link
      </base-material-alert>
    </v-card-text>
  </base-material-card>
</template>

<script>
  import axios from 'axios'

  export default {
    data: () => ({
      loading: false,
      planHolder: {},
      fieldData: [
        {
          label: 'Plan Holder Name',
          att: 'plan_holder',
        },
        {
          label: 'Plan Number',
          att: 'plan_number',
        },
        {
          label: 'Plan Preparer',
          att: 'plan_preparer',
        },
        {
          label: 'Plan Type',
          att: 'plan_type',
        },
        {
          label: 'Plan Approved',
          att: 'approval_date',
        },
        {
          label: 'Status',
          att: 'status',
        },
        {
          label: 'Plan Expiration',
          att: 'plan_exp_date',
        },
        {
          label: 'WCD',
          att: 'wcd_barrels',
        },
        {
          label: 'Tank Expiration',
          att: 'tank_expiration_date',
        },
        {
          label: 'SMFF Provider',
          att: 'primary_smff',
        },
        {
          label: 'Non-Tank Expiration',
          att: 'nt_expiration_date',
        },
        {
          label: 'OSRO',
          att: 'osro',
        },
      ],
      fieldData1: [
        {
          label: 'Address 1',
          att: 'holder_address_1',
        },
        {
          label: 'Address 2',
          att: 'holder_address_2',
        },
        {
          label: 'City',
          att: 'holder_city',
        },
        {
          label: 'State',
          att: 'holder_state',
        },
        {
          label: 'Country',
          att: 'holder_country',
        },
        {
          label: 'Zip:',
          att: 'holder_zip',
        },
      ],
    }),
    mounted () {
      this.getDataFromApi()
    },
    methods: {
      getDataFromApi () {
        this.loading = true
        axios.get('companies/' + this.$route.params.id + '/short')
          .then(res => {
            const planNumber = res.data.data.plan_number
            axios.get('companies/VRPexpress/' + planNumber)
              .then(res => {
                this.planHolder = res.data.plan_detail
                this.loading = false
              })
          })
      },
    },
  }
</script>
