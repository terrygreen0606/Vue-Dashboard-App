import axios from 'axios'
import { guardAPI } from '@/shared/management'

export const menuitems = {
  state: {
    companyItems: [],
    vesselTypeItems: [],
    fleetItems: [],
    networkItems: [],
    piItems: [],
    qiItems: [],
    societyItems: [],
    pocItems: [],
    roleItems: [],
    userTypeItems: [],
    zoneItems: [],
    providerItems: [],
    insurerItems: [],
    alertItems: null,
    vesselInfo: [],
    vendorTypes: [],
    statusItems: [
      { text: 'All', value: -1 },
      { text: 'Active', value: 1 },
      { text: 'Inactive', value: 0 },
    ],
    resourceProviderItems: [
      { text: 'All', value: -1 },
      { text: 'Provider', value: 1 },
      { text: 'Non-provider', value: 0 },
    ],
    vrpItems: [
      { text: 'All', value: -1 },
      { text: 'Authorized', value: 1 },
      { text: 'Not Authorized', value: 0 },
    ],
    countryItems: [],
    planPreparers: [],
  },
  mutations: {
    INIT_MENU_ITEMS (state) {
      axios.get('alerts')
        .then(res => {
          state.alertItems = res.data
        })
    },

    SET_VESSEL_INFO (state, { data }) {
      state.vesselInfo = data
    },

    SET_VESSEL_TYPE_ITEMS (state, { data }) {
      state.vesselTypeItems = data
    },

    SET_FLEET_ITEMS (state, { data }) {
      state.fleetItems = data
    },

    SET_NETWORK_ITEMS (state, { data }) {
      state.networkItems = data
    },

    SET_PI_ITEMS (state, { data }) {
      state.piItems = data
    },

    SET_QI_ITEMS (state, { data }) {
      state.qiItems = data
    },

    SET_SOCIETY_ITEMS (state, { data }) {
      state.societyItems = data
    },

    SET_POC_ITEMS (state, { data }) {
      state.pocItems = data
    },

    SET_ROLE_ITEMS (state, { data }) {
      state.roleItems = data
    },

    SET_USER_TYPE_ITEMS (state, { data }) {
      state.userTypeItems = data
    },

    SET_ZONE_ITEMS (state, { data }) {
      state.zoneItems = data
    },

    SET_PROVIDER_ITEMS (state, { data }) {
      state.providerItems = data
    },

    SET_INSURER_ITEMS (state, { data }) {
      state.insurerItems = data
    },

    SET_COUNTRY_ITEMS (state, { data }) {
      state.countryItems = data
    },

    SET_COMPANY_INFO (state, { data }) {
      state.companyInfo = data
    },

    SET_COMPANY_ITEMS (state, { data }) {
      state.companyItems = data
    },

    SET_VENDOR_TYPES (state, { data }) {
      state.vendorTypes = data
    },

    SET_PLAN_PREPARERS (state, { data }) {
      state.planPreparers = data
    },
  },

  actions: {
    initMenuItems ({ commit }) {
      commit('INIT_MENU_ITEMS')
    },

    getVesselInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        axios.get('vessels/getVesselInfo')
          .then(res => {
            commit({ type: 'SET_VESSEL_INFO', data: res.data })
            resolve()
          })
          .catch(err => reject(err))
      })
    },

    getVesselTypeItems ({ commit }) {
      return new Promise((resolve, reject) => {
        axios.get('vessels/types')
          .then(res => {
            commit({ type: 'SET_VESSEL_TYPE_ITEMS', data: res.data.data })
            resolve()
          })
          .catch(err => reject(err))
      })
    },

    getFleetItems ({ commit }) {
      return new Promise((resolve, reject) => {
        if (this.state.authentication.role) {
          if (guardAPI('fleets', this.state.authentication.role.id)) {
            axios.get('fleets')
              .then(res => {
                commit({ type: 'SET_FLEET_ITEMS', data: res.data.data })
                resolve()
              })
              .catch(err => reject(err))
          } else resolve()
        } else {
          this.watch(state => state.authentication.role, role => {
            if (role && guardAPI('fleets', role.id)) {
              axios.get('fleets')
                .then(res => {
                  commit({ type: 'SET_FLEET_ITEMS', data: res.data.data })
                  resolve()
                })
                .catch(err => reject(err))
            } else resolve()
          })
        }
      })
    },

    getNetworkItems ({ commit }) {
      return new Promise((resolve, reject) => {
        axios.get('networks/short')
          .then(res => {
            commit({ type: 'SET_NETWORK_ITEMS', data: res.data.data })
            resolve()
          })
          .catch(err => reject(err))
      })
    },

    getPiItems ({ commit }) {
      return new Promise((resolve, reject) => {
        if (this.state.authentication.role) {
          if (guardAPI('vendors/pi', this.state.authentication.role.id)) {
            axios.get('vendors/pi')
              .then(res => {
                commit({ type: 'SET_PI_ITEMS', data: res.data.data })
                resolve()
              })
              .catch(err => reject(err))
          } else resolve()
        } else {
          this.watch(state => state.authentication.role, role => {
            if (role && guardAPI('vendors/pi', role.id)) {
              axios.get('vendors/pi')
                .then(res => {
                  commit({ type: 'SET_PI_ITEMS', data: res.data.data })
                  resolve()
                })
                .catch(err => reject(err))
            } else resolve()
          })
        }
      })
    },

    getQiItems ({ commit }) {
      return new Promise((resolve, reject) => {
        if (this.state.authentication.role) {
          if (guardAPI('vendors/qi', this.state.authentication.role.id)) {
            axios.get('vendors/qi')
              .then(res => {
                commit({ type: 'SET_QI_ITEMS', data: res.data.data })
                resolve()
              })
              .catch(err => reject(err))
          } else resolve()
        } else {
          this.watch(state => state.authentication.role, role => {
            if (role && guardAPI('vendors/qi', role.id)) {
              axios.get('vendors/qi')
                .then(res => {
                  commit({ type: 'SET_QI_ITEMS', data: res.data.data })
                  resolve()
                })
                .catch(err => reject(err))
            } else resolve()
          })
        }
      })
    },

    getSocietyItems ({ commit }) {
      return new Promise((resolve, reject) => {
        if (this.state.authentication.role) {
          if (guardAPI('vendors/societies', this.state.authentication.role.id)) {
            axios.get('vendors/societies')
              .then(res => {
                const mapped = res.data.data.length ? res.data.data.map(society => ({ ...society, fullname: society.shortname + ' - ' + society.name })) : []
                commit({ type: 'SET_SOCIETY_ITEMS', data: mapped })
                resolve()
              })
              .catch(err => reject(err))
          } else resolve()
        } else {
          this.watch(state => state.authentication.role, role => {
            if (role && guardAPI('vendors/societies', role.id)) {
              axios.get('vendors/societies')
                .then(res => {
                  const mapped = res.data.data.length ? res.data.data.map(society => ({ ...society, fullname: society.shortname + ' - ' + society.name })) : []
                  commit({ type: 'SET_SOCIETY_ITEMS', data: mapped })
                  resolve()
                })
                .catch(err => reject(err))
            } else resolve()
          })
        }
      })
    },

    getPocItems ({ commit }) {
      return new Promise((resolve, reject) => {
        if (this.state.authentication.role) {
          if (guardAPI('companies/user/poc', this.state.authentication.role.id)) {
            axios.get('companies/user/poc')
              .then(res => {
                commit({ type: 'SET_POC_ITEMS', data: res.data.data })
                resolve()
              })
              .catch(err => reject(err))
          } else resolve()
        } else {
          this.watch(state => state.authentication.role, role => {
            if (role && guardAPI('companies/user/poc', role.id)) {
              axios.get('companies/user/poc')
                .then(res => {
                  commit({ type: 'SET_POC_ITEMS', data: res.data.data })
                  resolve()
                })
                .catch(err => reject(err))
            } else resolve()
          })
        }
      })
    },

    getRoleItems ({ commit }) {
      return new Promise((resolve, reject) => {
        axios.get('roles')
          .then(res => {
            commit({ type: 'SET_ROLE_ITEMS', data: res.data.data })
            resolve()
          })
          .catch(err => reject(err))
      })
    },

    getUserTypeItems ({ commit }) {
      return new Promise((resolve, reject) => {
        axios.get('contacttypes')
          .then(res => {
            commit({ type: 'SET_USER_TYPE_ITEMS', data: res.data.data })
            resolve()
          })
          .catch(err => reject(err))
      })
    },

    getZoneItems ({ commit }) {
      return new Promise((resolve, reject) => {
        axios.get('zones/short')
          .then(res => {
            commit({ type: 'SET_ZONE_ITEMS', data: res.data.data })
            resolve()
          })
          .catch(err => reject(err))
      })
    },

    getProviderItems ({ commit }) {
      return new Promise((resolve, reject) => {
        if (this.state.authentication.role) {
          if (guardAPI('vendors/providers', this.state.authentication.role.id)) {
            axios.get('vendors/providers')
              .then(res => {
                commit({ type: 'SET_PROVIDER_ITEMS', data: res.data.data })
                resolve()
              })
              .catch(err => reject(err))
          } else resolve()
        } else {
          this.watch(state => state.authentication.role, role => {
            if (role && guardAPI('vendors/providers', role.id)) {
              axios.get('vendors/providers')
                .then(res => {
                  commit({ type: 'SET_PROVIDER_ITEMS', data: res.data.data })
                  resolve()
                })
                .catch(err => reject(err))
            } else resolve()
          })
        }
      })
    },

    getInsurerItems ({ commit }) {
      return new Promise((resolve, reject) => {
        if (this.state.authentication.role) {
          if (guardAPI('vendors/insurers', this.state.authentication.role.id)) {
            axios.get('vendors/insurers')
              .then(res => {
                commit({ type: 'SET_INSURER_ITEMS', data: res.data.data })
                resolve()
              })
              .catch(err => reject(err))
          } else resolve()
        } else {
          this.watch(state => state.authentication.role, role => {
            if (role && guardAPI('vendors/insurers', role.id)) {
              axios.get('vendors/insurers')
                .then(res => {
                  commit({ type: 'SET_INSURER_ITEMS', data: res.data.data })
                  resolve()
                })
                .catch(err => reject(err))
            } else resolve()
          })
        }
      })
    },

    getVendorTypes ({ commit }) {
      return new Promise((resolve, reject) => {
        if (this.state.authentication.role) {
          if (guardAPI('vendors/types', this.state.authentication.role.id)) {
            axios.get('vendors/types')
              .then(res => {
                commit({ type: 'SET_VENDOR_TYPES', data: res.data.data })
                resolve()
              })
              .catch(err => reject(err))
          } else resolve()
        } else {
          this.watch(state => state.authentication.role, role => {
            if (role && guardAPI('vendors/types', role.id)) {
              axios.get('vendors/types')
                .then(res => {
                  commit({ type: 'SET_VENDOR_TYPES', data: res.data.data })
                  resolve()
                })
                .catch(err => reject(err))
            } else resolve()
          })
        }
      })
    },

    getCountryItems ({ commit }) {
      return new Promise((resolve, reject) => {
        axios.get('address/countries')
          .then(res => {
            commit({ type: 'SET_COUNTRY_ITEMS', data: res.data.data })
            resolve()
          })
          .catch(err => reject(err))
      })
    },

    getCompanyItems ({ commit }) {
      return new Promise((resolve, reject) => {
        if (this.state.authentication.role) {
          if (guardAPI('companies/short', this.state.authentication.role.id)) {
            axios.get('companies/short')
              .then(res => {
                commit({ type: 'SET_COMPANY_ITEMS', data: res.data.data })
                resolve()
              })
              .catch(err => reject(err))
          } else resolve()
        } else {
          this.watch(state => state.authentication.role, role => {
            if (role && guardAPI('companies/short', role.id)) {
              axios.get('companies/short')
                .then(res => {
                  commit({ type: 'SET_COMPANY_ITEMS', data: res.data.data })
                  resolve()
                })
                .catch(err => reject(err))
            } else resolve()
          })
        }
      })
    },

    getPlanPreparers ({ commit }) {
      return new Promise((resolve, reject) => {
        axios.get('companies/planpreparer')
          .then(res => {
            commit({ type: 'SET_PLAN_PREPARERS', data: res.data })
            resolve()
          })
          .catch(err => reject(err))
      })
    },
  },
}
