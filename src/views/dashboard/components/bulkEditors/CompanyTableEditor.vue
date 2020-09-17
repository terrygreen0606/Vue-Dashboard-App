<template>
  <div class="wrapper-jexcel">
    <v-progress-circular
      v-if="saving"
      indeterminate
      class="bulk-saving"
    />
    <div
      v-else
      id="spreadsheet"
      ref="spreadsheet"
    />
  </div>
</template>

<script>
  /* eslint-disable */
  import jexcelStyle from 'jexcel/dist/jexcel.css'
  import jexcel from 'jexcel'
  import axios from 'axios'
  import {
    getColumnsFromCompanies,
    formatNumber,
  } from '../../../../shared/bulkEditUtils'
  import { BULK_EDITOR_COLUMNS } from '../../../../shared/constants'

  export default {
    name: 'CompanyTableEditor',

    props: {
      companyData: {
        type: Array,
        default: () => ([]),
      },
      minDimensions: {
        type: Array,
        default: () => ([]),
      },
      updatedStatus: {
        type: Number,
        default: 0,
      },
    },
    data: () => ({
      updatedData: [],
      saving: false,
    }),
    watch: {
      companyData: {
        handler () {
          this.updateJExcelOptions()
        },
        deep: true,
      },
      minDimensions () {
        this.updateJExcelOptions()
      },
      updatedData: {
        handler () {
          if (this.updatedData.length > 0) {
            this.$emit('change:content-changed')
          }
        },
      },
      updatedStatus () {
        if (this.updatedStatus <= 0) {
          return
        }
        const updatedIDs = this.updatedData.map(i => i[6])
        const companyDataToSave = this.companyData
          .filter(i => updatedIDs.includes(i.id))
          .map(i => {
            const row = this.updatedData.find(j => j[6] === i.id)
            return {
              id: i.id,
              name: row[0],
              plan_number: formatNumber(row[1]),
              qi_id: row[2],
              active: row[3] === 'YES',
              networks_active: row[4] === 'YES' ? 1 : 0,
            }
          })
        // No update
        if (companyDataToSave.length === 0) {
          this.$emit('change:save-update', 0)
          return
        }
        this.saveCompanies(companyDataToSave)
      }
    },
    mounted () {
      this.setJExcelOptions()
    },
    methods: {
      handleCellChange (instance, cell, x, y, value) {
        const { qiItems, countryItems } = this.$store.state.menuitems
        const columns = Object.values(
          BULK_EDITOR_COLUMNS.companies({ countryItems, qiItems }))

        const isValidLength = columns.length > x
        if(!isValidLength) {
          this.$toast.error(`Row ${y + 1} is overflowed`)
        }

        if(isValidLength && columns[x].type == 'dropdown') {
          const items = columns[x].source.map(element => (element.id ? element.id : element))
          const isValid = items.includes(value) || items.includes(parseInt(value))
          if(!isValid && items.length > 0) {
            this.$toast.warning(`Cell(${columns[x].title},${y + 1}) doesn't match list or not Selected.`)
          }
        }

        const rData = this.jExcelObj.getRowData(y)
        const rIndex = this.updatedData.findIndex(i => i[6] === rData[6]) // if ID is same
        if (rIndex > -1) {
          this.updatedData[rIndex] = rData
        } else {
          this.updatedData.push(rData)
        }
      },
      setJExcelOptions () {
        const { qiItems, countryItems } = this.$store.state.menuitems
        const columns = Object.values(
          BULK_EDITOR_COLUMNS.companies({ countryItems, qiItems })
        )
        const jExcelOptions = {
          data: getColumnsFromCompanies(this.companyData),
          minDimensions: this.minDimensions,
          columns,
          tableOverflow: true,
          defaultColWidth: 100,
          onchange: this.handleCellChange,
        }
        const jExcelObj = jexcel(this.$refs['spreadsheet'], jExcelOptions)
        Object.assign(this, { jExcelObj })
      },
      updateJExcelOptions () {
        this.jExcelObj.setData(getColumnsFromCompanies(this.companyData))
      },
      async saveCompanies (companies) {
        this.saving = true
        let updatedCount = 0
        let errCount = 0
        const promises = companies.map(async company => {
          return await axios.post('companies/' + company.id, company)
            .then(res => { updatedCount++ })
            .catch(err => {
              errCount++
            })
        })
        try {
          await Promise.all(promises)
        } catch (err) {
          // Ingore
        }
        this.saving = false
        this.$emit('change:save-update', updatedCount, errCount)
      },
    },
  }
</script>

<style lang="sass">
  .bulk-saving
    left: 50%
    transform: translateX(-16px)
  .wrapper-jexcel
    padding-right: 0px
  .jexcel_container
    padding-right: 0px
    width: 100% !important
    border: 1px solid #ccc
  .jexcel_content
    padding-right: 0px
    width: 100%
    max-height: none !important
  .snackbar-queue
    .v-btn--icon.v-size--default .v-icon
      font-size: 15px
</style>
