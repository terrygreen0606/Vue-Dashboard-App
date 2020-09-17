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
  import { BULK_EDITOR_COLUMNS } from '../../../../shared/constants'
  import {
    getColumnsFromVessels,
    splitMultiDropdownValues,
    formatNumber,
  } from '../../../../shared/bulkEditUtils'

  export default {
    name: 'TableEditor',

    props: {
      vesselData: {
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
      errorItems: []
    }),
    watch: {
      vesselData: {
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
        const updatedIDs = this.updatedData.map(i => i[15])
        const vesselDataToSave = this.vesselData
          .filter(i => updatedIDs.includes(i.id))
          .map(i => {
            const row = this.updatedData.find(j => j[15] === i.id)
            return {
              id: i.id, // 15
              company_id: formatNumber(row[0]),
              name: row[1],
              imo: formatNumber(row[2]),
              official_number: formatNumber(row[3]),
              vessel_type_id: formatNumber(row[4]),
              societies: splitMultiDropdownValues(row[5]),
              dead_weight: formatNumber(row[6]),
              qi: i.qi,
              pi: splitMultiDropdownValues(row[7]),
              insurers: splitMultiDropdownValues(row[8]),
              deck_area: formatNumber(row[9]),
              oil_tank_volume: formatNumber(row[10]),
              oil_group: row[11] || null,
              providers: splitMultiDropdownValues(row[12]),
              tanker: row[13] === 'YES',
              active: row[14] === 'YES',
            }
          })
        // No update
        if (vesselDataToSave.length === 0) {
          this.$emit('change:save-update', 0)
          return
        }
        this.saveVessels(vesselDataToSave)
      },
    },
    mounted () {
      this.setJExcelOptions()
    },
    methods: {
      handleCellChange (instance, cell, x, y, value) {
        const {
          companyItems,
          vesselTypeItems,
          societyItems,
          piItems,
          insurerItems,
          providerItems
        } = this.$store.state.menuitems
        const columns = Object.values(
          BULK_EDITOR_COLUMNS.vessels({
            companyItems,
            vesselTypeItems,
            societyItems,
            piItems,
            insurerItems,
            providerItems,
          }))

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
        const rIndex = this.updatedData.findIndex(i => i[15] === rData[15])
        if (rIndex > -1) {
          this.updatedData[rIndex] = rData
        } else {
          this.updatedData.push(rData)
        }
      },
      setJExcelOptions () {
        const {
          companyItems,
          vesselTypeItems,
          societyItems,
          piItems,
          insurerItems,
          providerItems,
        } = this.$store.state.menuitems

        const columns = Object.values(BULK_EDITOR_COLUMNS.vessels({
          companyItems,
          vesselTypeItems,
          societyItems,
          piItems,
          insurerItems,
          providerItems,
        }))
        const jExcelOptions = {
          data: getColumnsFromVessels(this.vesselData),
          minDimensions: this.minDimensions,
          columns,
          tableOverflow: true,
          defaultColWidth: 100,
          loadingSpin: true,
          onchange: this.handleCellChange,
        }
        const jExcelObj = jexcel(this.$refs['spreadsheet'], jExcelOptions)
        Object.assign(this, { jExcelObj })
      },
      updateJExcelOptions () {
        this.jExcelObj.setData(getColumnsFromVessels(this.vesselData))
      },
      async saveVessels (vessels) {
        this.saving = true
        let updatedCount = 0
        let errCount = 0
        const promises = vessels.map(async vessel => {
          return await axios.post('vessels/' + vessel.id, vessel)
            .then(res => { updatedCount++ })
            .catch(err => {
              errCount++
            })
        })
        try {
          await Promise.all(promises)
        } catch (err) {
          // Ignore error
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
</style>
