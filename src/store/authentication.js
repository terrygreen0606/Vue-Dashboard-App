import axios from 'axios'
import cookies from 'js-cookie'

export const authentication = {
  state: {
    user: {},
    role: null,
    token: null,
  },
  mutations: {
    SET_USER (state, data) {
      state.user = data
      if (data) {
        state.user.full_name = data.first_name + ' ' + data.last_name
      }
    },
    SET_ROLE (state, data) {
      state.role = data
    },
    SET_TOKEN (state, data) {
      state.token = data
    },
    RESET (state) {
      delete axios.defaults.headers.common.Authorization
      cookies.remove('x-access-token')
    },
  },
  actions: {
    async login ({ commit }, data) {
      const res = await axios.post('auth/login', data)
      commit('SET_USER', res.data.user)
      commit('SET_ROLE', res.data.role)
      commit('SET_TOKEN', res.data.token)
      axios.defaults.headers.common.Authorization = 'Bearer ' + res.data.token
      cookies.set('x-access-token', res.data.token, { expires: data.rememberMe ? 365 : 1 })
      return res
    },
    async logout ({ commit }) {
      await commit('RESET')
      await this.reset()
      return true
    },
    check ({ commit }, token) {
      if (token) {
        axios.defaults.headers.common.Authorization = 'Bearer ' + token
        axios.post('auth/me')
          .then(res => {
            commit('SET_USER', res.data.user)
            commit('SET_ROLE', res.data.role)
            commit('SET_TOKEN', token)
            return res
          }).catch(error => {
            commit('RESET')
            this.reset()
            return error
          })
      }
    },
  },
}
