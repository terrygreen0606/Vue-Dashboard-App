<template>
  <div>
    <base-material-card
      color="primary"
      title="Vessel Construction"
    >
      <v-progress-linear
        v-if="loading || loadingDimensions"
        indeterminate
      />
      <v-card-text>
        <base-material-tabs
          v-model="activeTab"
          color="info"
          :fixed-tabs="$vuetify.breakpoint.smAndUp"
          show-arrows
          height="36"
        >
          <v-tab>
            Vessel Relationships
          </v-tab>
          <v-tab>
            Dimensions
          </v-tab>
          <v-tabs-items
            v-model="activeTab"
            class="tabs-container"
          >
            <v-tab-item>
              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-switch
                    v-model="editedItem.lead_ship"
                    class="ml-3"
                    label="Lead Ship"
                    :disabled="!role || role && !checkCUD(role.id)"
                    @change="saveLead"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-select
                    v-model="editedItem.providers"
                    :items="providerItems"
                    item-text="name"
                    item-value="id"
                    multiple
                    clearable
                    :loading="savingProvider"
                    :disabled="!role || role && !checkCUD(role.id)"
                    prepend-icon="mdi-anchor"
                    label="Damage Stability Provider"
                    @change="saveProvider"
                  />
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item>
              <v-row>
                <v-col
                  v-for="(item, index) in Object.keys(dimensions)"
                  :key="index"
                  cols="12"
                  md="6"
                >
                  <v-switch
                    v-if="dimensions[item].model === 'construction_bulbous_bow'"
                    v-model="dimensionsModel[dimensions[item].model]"
                    :label="item"
                    :prepend-icon="dimensions[item].icon"
                  />
                  <v-text-field
                    v-else
                    v-model.number="dimensionsModel[dimensions[item].model]"
                    type="number"
                    :label="item"
                    :prepend-icon="dimensions[item].icon"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-btn
                    color="primary"
                    class="mt-4"
                    rounded
                    block
                    :loading="savingDimensions"
                    @click="saveDimensions"
                  >
                    <v-icon left>
                      mdi-content-save
                    </v-icon>
                    Save Dimensions
                  </v-btn>
                </v-col>
              </v-row>
            </v-tab-item>
          </v-tabs-items>
        </base-material-tabs>
      </v-card-text>
    </base-material-card>
    <base-material-card
      color="secondary"
      class="relation-tree"
    >
      <template v-slot:heading>
        <div class="display-2 font-weight-light">
          Vessel Relationship Tree
        </div>
        <v-btn
          color="primary"
          rounded
          @click="addRelation = true"
        >
          <v-icon left>
            mdi-bookmark-plus-outline
          </v-icon>
          Add Vessel Relation
        </v-btn>
      </template>
      <v-progress-linear
        v-if="loadingRelations"
        indeterminate
      />
      <v-treeview
        v-else
        dense
        class="mt-5"
        open-all
        :items="treeItems"
      >
        <template
          slot="label"
          slot-scope="props"
        >
          <v-row
            v-if="props.item.id > 0"
            class="py-2 mx-0 align-center"
          >
            <v-speed-dial
              v-model="relationsFab[props.item.id]"
              direction="right"
              class="d-flex"
            >
              <template v-slot:activator>
                <v-btn
                  v-model="relationsFab[props.item.id]"
                  fab
                  x-small
                  color="primary"
                  class="no-boxshadow"
                >
                  <v-icon v-if="relationsFab[props.item.id]">
                    mdi-close
                  </v-icon>
                  <v-icon v-else>
                    mdi-chevron-right
                  </v-icon>
                </v-btn>
              </template>
              <v-btn
                fab
                x-small
                color="error"
                class="no-boxshadow ma-0 mr-2"
                @click="deleteRelation(props.item)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <router-link :to="`/vessels/${props.item.id}/construction`">
                <v-btn
                  fab
                  x-small
                  color="success"
                  class="no-boxshadow ma-0 mr-4"
                >
                  <v-icon>mdi-eye-check</v-icon>
                </v-btn>
              </router-link>
            </v-speed-dial>
            <span class="align-center">{{ props.item.name }}</span>
          </v-row>
          <span v-else>{{ props.item.name }}</span>
        </template>
      </v-treeview>
    </base-material-card>
    <v-dialog
      v-model="addRelation"
      max-width="500"
    >
      <v-card class="add-vessel-dlg">
        <v-card-title class="headline">
          Add Vessel Relationship
        </v-card-title>
        <v-card-subtitle
          class="d-flex justify-center mt-0"
        >
          Select One Only
        </v-card-subtitle>
        <v-divider />
        <v-row
          v-if="editedItem.lead_ship"
          class="mx-auto"
          justify="space-around"
        >
          <v-col cols="12">
            <v-radio-group
              v-model="childRadio"
              row
            >
              <v-radio
                label="Child Vessel"
                value="child"
              />
              <v-radio
                label="Sister Vessel"
                value="sister"
              />
            </v-radio-group>
          </v-col>
          <v-col cols="12">
            <v-autocomplete
              v-if="childRadio === 'child'"
              v-model="relationData.child_vessel"
              :items="filteredChild"
              :loading="searchingChild"
              :search-input.sync="searchChild"
              hide-no-data
              hide-selected
              item-text="name"
              item-value="id"
              clearable
              label="Child Vessels"
              placeholder="Vessel Name or IMO"
              prepend-icon="mdi-ferry"
              :rules="[v => !!v || 'Child Vessel is required']"
            />
            <v-autocomplete
              v-if="childRadio === 'sister'"
              v-model="relationData.sister_vessel"
              :items="filteredSister"
              :loading="searchingSister"
              :search-input.sync="searchSister"
              hide-no-data
              hide-selected
              item-text="name"
              item-value="id"
              clearable
              label="Sister Vessels"
              placeholder="Vessel Name or IMO"
              prepend-icon="mdi-ferry"
              :rules="[v => !!v || 'Sister Vessel is required']"
            />
          </v-col>
        </v-row>
        <v-row
          v-else
          class="mx-auto"
          justify="space-around"
        >
          <v-col cols="12">
            <v-radio-group
              v-model="parentRadio"
              row
            >
              <v-radio
                label="Lead Parent"
                value="parent"
              />
              <v-radio
                label="Lead Sister"
                value="lead_sister"
              />
            </v-radio-group>
          </v-col>
          <v-col cols="12">
            <v-autocomplete
              v-if="parentRadio === 'parent'"
              v-model="relationData.lead_ship_id"
              :items="filteredParent"
              :loading="searchingParent"
              :search-input.sync="searchParent"
              hide-no-data
              hide-selected
              item-text="name"
              item-value="id"
              label="Parent Vessel"
              placeholder="Vessel Name or IMO"
              prepend-icon="mdi-ferry"
              :rules="[v => !!v || 'Lead Parent Vessel is required']"
            />
            <v-autocomplete
              v-if="parentRadio === 'lead_sister'"
              v-model="relationData.lead_sister_ship_id"
              :items="filteredLeadSister"
              :loading="searchingLeadSister"
              :search-input.sync="searchLeadSister"
              hide-no-data
              hide-selected
              item-text="name"
              item-value="id"
              label="Lead Sister Vessel"
              placeholder="Vessel Name or IMO"
              prepend-icon="mdi-ferry"
              :rules="[v => !!v || 'Lead Sister Vessel is required']"
            />
          </v-col>
        </v-row>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="error"
            @click="addRelation = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="success"
            :loading="saving"
            @click="saveRelations"
          >
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import { mapActions, mapState } from 'vuex'
  import { providerItemsDownload } from '@/mixins/menuItemsDownload/providerItemsDownload'
  import { checkCUD } from '@/shared/management'

  export default {
    mixins: [
      providerItemsDownload,
    ],
    data: () => ({
      loading: 0,
      editedItem: {},
      activeTab: 0,
      saving: false,
      loadingRelations: false,
      loadingDimensions: false,
      savingDimensions: false,
      dimensionsModel: {},
      dimensions: {
        'Length Overall': { icon: 'mdi-ruler', model: 'construction_length_overall' },
        'Length (BP)': { icon: 'mdi-roman-numeral-2', model: 'construction_length_bp' },
        'Length (Reg)': { icon: 'mdi-pencil-ruler', model: 'construction_length_reg' },
        'Bulbous Bow': { icon: 'mdi-water', model: 'construction_bulbous_bow' },
        'Breadth Extreme': { icon: 'mdi-ruler-square', model: 'construction_breadth_extreme' },
        'Breadth Moulded': { icon: 'mdi-tape-measure', model: 'construction_breadth_moulded' },
        Draught: { icon: 'mdi-tape-measure', model: 'construction_draught' },
        Depth: { icon: 'mdi-cup-water', model: 'construction_depth' },
        Height: { icon: 'mdi-inbox-arrow-down-outline', model: 'construction_height' },
        'T/CM': { icon: 'mdi-axis-arrow', model: 'construction_tcm' },
        Displacement: { icon: 'mdi-water-polo', model: 'construction_displacement' },
      },
      treeItems: [],
      childVessels: [],
      sisterVessels: [],
      searchingChild: false,
      searchingSister: false,
      searchChild: null,
      searchSister: null,
      parentVessels: [],
      leadSisterVessels: [],
      searchingParent: false,
      searchingLeadSister: false,
      searchParent: null,
      searchLeadSister: null,
      addRelation: false,
      savingProvider: false,
      relationsFab: {},
      parentRadio: 'parent',
      childRadio: 'child',
      relationData: {},
      checkCUD,
      timeout: null,
    }),
    computed: {
      ...mapState({
        role: state => state.authentication.role,
      }),
      filteredChild () {
        return this.childVessels.filter(child => child.id !== parseInt(this.$route.params.id))
      },
      filteredSister () {
        return this.sisterVessels.filter(sister => sister.id !== parseInt(this.$route.params.id))
      },
      filteredParent () {
        return this.parentVessels.filter(parent => parent.id !== parseInt(this.$route.params.id))
      },
      filteredLeadSister () {
        return this.leadSisterVessels.filter(vessel => vessel.id !== parseInt(this.$route.params.id))
      },
    },
    watch: {
      searchChild (val) {
        if (this.timeout) clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          val && val.length >= 3 && val !== this.editedItem.child_vessels && !this.searchingChild && this.getChildSisterVessels(val, true)
        }, 1000)
      },
      searchSister (val) {
        if (this.timeout) clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          val && val.length >= 3 && val !== this.editedItem.sister_vessels && !this.searchingSister && this.getChildSisterVessels(val, false)
        }, 1000)
      },
      searchParent (val) {
        // Add return-object property to v-autocomplete lead_ship to stop sending in case of same vessel
        // And add this condition "val !== this.editedItem.lead_ship_id.name" to below
        if (this.timeout) clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          val && val.length >= 3 && !this.searchingParent && this.getLeadVessels(val, true)
        }, 1000)
      },
      searchLeadSister (val) {
        // Add return-object property to v-autocomplete lead_ship to stop sending in case of same vessel
        // And add this condition "val !== this.editedItem.lead_sister_ship_id.name" to below
        if (this.timeout) clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          val && val.length >= 3 && !this.searchingSister && this.getLeadVessels(val, false)
        }, 1000)
      },
      $route (to, from) {
        if (to.params.id !== from.params.id) {
          this.getDataFromApi()
        }
      },
    },
    mounted () {
      this.getDataFromApi()
    },
    methods: {
      ...mapActions({
        showSnackBar: 'showSnackBar',
      }),
      getLeadVessels (query, parentOrSis) {
        parentOrSis ? this.searchingParent = true : this.searchingLeadSister = true
        axios.get(`vessels/lead/list?query=${query}`)
          .then(res => {
            parentOrSis ? this.parentVessels = res.data.data : this.leadSisterVessels = res.data.data
          })
          .finally(() => {
            parentOrSis ? this.searchingParent = false : this.searchingLeadSister = false
          })
      },
      getChildSisterVessels (query, childOrSis) {
        childOrSis ? this.searchingChild = true : this.searchingSister = true
        axios.get(`vessels/related/list?query=${query}`)
          .then(res => {
            childOrSis ? this.childVessels = res.data.data : this.sisterVessels = res.data.data
          })
          .finally(() => {
            childOrSis ? this.searchingChild = false : this.searchingSister = false
          })
      },
      getDataFromApi () {
        this.loading++
        this.loadingRelations = true
        axios.get('vessels/' + this.$route.params.id + '/constructionDetail')
          .then(res => {
            this.editedItem = res.data.data[0]
            this.dimensionsModel = this.editedItem.construction_detail
            this.treeItems =
              this.editedItem.lead_ship
                ? [
                  {
                    id: -1,
                    name: `${this.editedItem.name} is a Lead Vessel`,
                    children: [
                      {
                        id: -2,
                        name: 'Child Vessels',
                        children: this.editedItem.child_vessels.length
                          ? this.editedItem.child_vessels.map(child => {
                            if (child.lead_ship) {
                              return { id: child.id, name: `${child.name} - Parent Vessel`, type: 'child' }
                            } else {
                              return { id: child.id, name: child.name, type: 'child' }
                            }
                          })
                          : [{ id: -10, name: `${this.editedItem.name} has no child vessels.` }],
                      },
                      {
                        id: -3,
                        name: 'Sister Vessels',
                        children: this.editedItem.sister_vessels.length
                          ? this.editedItem.sister_vessels.map(sister => {
                            if (sister.lead_sister_ship) {
                              return { id: sister.id, name: `${sister.name} - Sister Vessel`, type: 'sister' }
                            } else {
                              return { id: sister.id, name: sister.name, type: 'sister' }
                            }
                          })
                          : [{ id: -11, name: `${this.editedItem.name} has no sister vessels.` }],
                      },
                    ],
                  },
                ]
                : [
                  {
                    id: -4,
                    name: `${this.editedItem.name} is not a Lead Vessel`,
                    children: [
                      { id: -5, name: 'Parent Vessel', children: this.editedItem.lead_ship_id ? [{ ...this.editedItem.lead_ship_id, type: 'lead_parent' }] : [{ id: -7, name: `${this.editedItem.name} Has No Parent Vessel` }] },
                      { id: -6, name: 'Lead Sister Vessel', children: this.editedItem.lead_sister_ship_id ? [{ ...this.editedItem.lead_sister_ship_id, type: 'lead_sister' }] : [{ id: -8, name: `${this.editedItem.name} Has No Lead Sister Vessel` }] },
                    ],
                  },
                ]
            this.childVessels = this.editedItem.child_vessels
            this.sisterVessels = this.editedItem.sister_vessels
            this.loading--
            this.loadingRelations = false
          })
      },
      saveRelations () {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        this.saving = true
        let data = { lead_ship: this.editedItem.lead_ship }
        if (this.editedItem.lead_ship) {
          data = this.childRadio === 'child' ? { ...data, child_vessel: this.relationData.child_vessel } : { ...data, sister_vessel: this.relationData.sister_vessel }
        } else {
          data = this.parentRadio === 'parent' ? { ...data, parent: this.relationData.lead_ship_id } : { ...data, lead_sister: this.relationData.lead_sister_ship_id }
        }
        axios.post('vessels/' + this.$route.params.id + '/updateRelation', data)
          .then(res => {
            this.getDataFromApi()
            this.showSnackBar({ text: res.data.message, color: 'success' })
            this.saving = false
            this.addRelation = false
            this.relationData = {}
          })
      },
      deleteRelation (item) {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        this.$confirm('Are you sure you want to remove this vessel relationship?', { title: 'Warning' })
          .then(res => {
            if (res) {
              const data = { vessel_id: parseInt(this.$route.params.id), ...item }
              axios.post('vessels/relation/remove', data)
                .then(res => {
                  this.getDataFromApi()
                  this.showSnackBar({ text: res.data.message, color: 'success' })
                })
            }
          })
      },
      saveDimensions () {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        this.savingDimensions = true
        axios.post(`vessels/${this.$route.params.id}/updateDimensions`, this.dimensionsModel)
          .then(res => {
            this.showSnackBar({ text: res.data.message, color: 'success' })
            this.savingDimensions = false
          })
      },
      saveProvider () {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        this.savingProvider = true
        axios.post(`vessels/${this.$route.params.id}/updateProviders`, { providers: this.editedItem.providers })
          .then(res => {
            this.showSnackBar({ text: res.data.message, color: 'success' })
            this.savingProvider = false
          })
      },
      saveLead () {
        if (!checkCUD(this.role.id)) {
          this.showSnackBar({ text: 'This action is not permitted.', color: 'warning' })
          return
        }
        axios.post(`vessels/${this.$route.params.id}/makeLead`, { lead_ship: this.editedItem.lead_ship })
          .then(res => {
            this.getDataFromApi()
            this.showSnackBar({ text: res.data.message, color: 'success' })
          })
      },
    },
  }
</script>

<style lang="sass">
  .tabs-container
    margin-top: 2rem
  .relation-tree
    .v-card--material__heading
      display: flex
      justify-content: space-between
      align-items: center
    .no-boxshadow
      -webkit-box-shadow: none
      -moz-box-shadow: none
      box-shadow: none
    .v-speed-dial__list
      position: initial
      padding: 0
  .add-vessel-dlg
    .v-input--radio-group__input
      justify-content: center
</style>
