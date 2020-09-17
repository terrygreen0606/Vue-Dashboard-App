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
    getColumnsFromUsers,
    splitMultiDropdownValues,
  } from '../../../../shared/bulkEditUtils'
  import { BULK_EDITOR_COLUMNS } from '../../../../shared/constants'

  export default {
    name: 'TableEditor',

    props: {
      userData: {
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
      userData: {
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
        const updatedIDs = this.updatedData.map(i => i[8])
        const userDataToSave = this.userData
          .filter(i => updatedIDs.includes(i.id))
          .map(i => {
            const row = this.updatedData.find(j => j[8] === i.id)

            return {
              user: {
                id: i.id,
                title: row[0],
                first_name: row[1],
                last_name: row[2],
                company: row[3],
                occupation: row[4],
                role_ids: row[5],
                email: row[6],
                mobile_number: row[7],
              }
            }
          })
        // No update
        if (userDataToSave.length === 0) {
          this.$emit('change:save-update', 0)
          return
        }
        this.saveUsers(userDataToSave)
      }
    },
    mounted () {
      this.setJExcelOptions()
    },
    methods: {
      handleCellChange (instance, cell, x, y, value) {
        const { companyInfo, roleItems } = this.$store.state.menuitems
        const columns = Object.values(BULK_EDITOR_COLUMNS.users({
            companies: companyInfo,
            roles: roleItems,
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
        const rIndex = this.updatedData.findIndex(i => i[8] === rData[8])
        if (rIndex > -1) {
          this.updatedData[rIndex] = rData
        } else {
          this.updatedData.push(rData)
        }
      },
      setJExcelOptions () {
        const { companyInfo, roleItems } = this.$store.state.menuitems

        const jExcelOptions = {
          data: getColumnsFromUsers(this.userData),
          minDimensions: this.minDimensions,
          columns: Object.values(BULK_EDITOR_COLUMNS.users({
            companies: companyInfo,
            roles: roleItems,
          })),
          tableOverflow: true,
          defaultColWidth: 100,
          loadingSpin: true,
          onchange: this.handleCellChange,
        }
        const jExcelObj = jexcel(this.$refs.spreadsheet, jExcelOptions)
        Object.assign(this, { jExcelObj })
      },
      updateJExcelOptions () {
        this.jExcelObj.setData(getColumnsFromUsers(this.userData))
      },
      async saveUsers (users) {
        this.saving = true
        let updatedCount = 0
        let errCount = 0
        const promises = users.map(async u => {
          return await axios.post('users/' + u.user.id, u)
            .then(res => { updatedCount++ })
            .catch(err => {
              errCount++
            })
        })

        try {
          await Promise.all(promises)
        } catch(err) {
          // Ignore
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
