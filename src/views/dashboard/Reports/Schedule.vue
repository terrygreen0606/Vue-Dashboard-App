<template>
  <base-material-card
    icon="mdi-notebook"
    title="Schedule Reports"
    color="primary"
  >
    <v-form
      ref="scheduleForm"
      lazy-validation
      @submit.prevent="scheduleReport"
    >
      <v-row no-gutters>
        <v-select
          v-model="schedule.report_type_id"
          prepend-icon="mdi-chart-bell-curve-cumulative"
          label="Report Type *"
          :items="reportTypes"
          :loading="loading"
          item-value="id"
          item-text="name"
          :rules="[required]"
        />
      </v-row>
      <v-row>
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="schedule.frequency_id"
            prepend-icon="mdi-clock-time-seven-outline"
            label="Frequency *"
            :items="frequency"
            :loading="loading"
            item-value="id"
            item-text="frequency_name"
            :rules="[required]"
          />
        </v-col>
        <v-spacer />
        <v-col
          v-if="schedule.frequency_id === 2"
          cols="12"
          md="4"
        >
          <v-select
            v-model="schedule.day"
            prepend-icon="mdi-calendar-blank"
            label="At Day *"
            :items="days"
            :rules="[required]"
          />
        </v-col>
        <v-col
          v-if="schedule.frequency_id === 3"
          cols="12"
          md="4"
        >
          <v-select
            v-model="schedule.date"
            prepend-icon="mdi-calendar-today"
            label="At Date *"
            :items="dates()"
            :rules="[required]"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="time"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="time"
                label="At Time *"
                prepend-icon="mdi-av-timer"
                readonly
                v-bind="attrs"
                :rules="[required]"
                v-on="on"
              />
            </template>
            <v-time-picker
              v-if="menu"
              v-model="time"
              full-width
              scrollable
              color="primary"
              @click:minute="$refs.menu.save(time)"
            />
          </v-menu>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-autocomplete
          v-model="schedule.user_ids"
          :items="users"
          :loading="loading"
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
      </v-row>
      <div class="pa-3 text-right">
        <v-btn
          color="success"
          type="submit"
          :loading="scheduling"
        >
          Schedule
        </v-btn>
      </div>
    </v-form>
  </base-material-card>
</template>

<script>
  import axios from 'axios'
  import { mapActions } from 'vuex'
  import { days, dates } from '@/shared/constants'

  export default {
    data: () => ({
      required: value => !!value || 'This field is required.',
      empty: value => value.length ? true : 'This field is required.',
      schedule: {},
      reportTypes: [],
      frequency: [],
      scheduling: false,
      loading: false,
      users: [],
      menu: false,
      time: null,
      days,
      dates,
    }),

    mounted () {
      this.prepareDropdowns()
    },

    methods: {
      ...mapActions({
        showSnackBar: 'showSnackBar',
      }),

      async prepareDropdowns () {
        this.loading = true
        try {
          const users = await axios.get('getAllUsersName')
          this.users = users.data.users
          const reportTypes = await axios.get('reports/reporttype')
          this.reportTypes = reportTypes.data
          const frequency = await axios.get('reports/frequency')
          this.frequency = frequency.data
        } catch (err) {
          this.showSnackBar({ text: err, color: 'error' })
        }
        this.loading = false
      },

      async scheduleReport () {
        if (this.$refs.scheduleForm.validate()) {
          this.scheduling = true
          try {
            this.schedule.time = this.time
            const response = await axios.post('reports/schedule', this.schedule)
            response.data.success
              ? this.showSnackBar({ text: response.data.message, color: 'success' })
              : this.showSnackBar({ text: response.data.message, color: 'error' })
          } catch (err) {
            this.showSnackBar({ text: err, color: 'error' })
          }
          this.scheduling = false
        }
      },
    },
  }
</script>
