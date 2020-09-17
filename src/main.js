// =========================================================
// * Vuetify Material Dashboard PRO - v2.1.0
// =========================================================
//
// * Product Page: https://www.creative-tim.com/product/vuetify-material-dashboard-pro
// * Copyright 2019 Creative Tim (https://www.creative-tim.com)
//
// * Coded by Creative Tim
//
// =========================================================
//
// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import './plugins/base'
import './plugins/chartist'
import './plugins/vee-validate'
import './plugins/vue-world-map'
import vuetify from './plugins/vuetify'
import i18n from './i18n'
import VuetifyConfirm from 'vuetify-confirm'
import VueClipboard from 'vue-clipboard2'
import FlagIcon from 'vue-flag-icon'
import axios from 'axios'
import cookies from 'js-cookie'
import VueToast from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import { apiUrl } from '../config'

axios.defaults.baseURL = apiUrl
const token = cookies.get('x-access-token')
if (token) {
  store.dispatch('check', token)
    .then(() => {
      store.dispatch('initMenuItems')
    })
}

var VueTruncate = require('vue-truncate-filter')
Vue.use(VueTruncate)
Vue.config.productionTip = false

Vue.use(VuetifyConfirm, { vuetify })
Vue.use(VueClipboard)
Vue.use(FlagIcon)
Vue.use(VueToast, {
  queue: true,
})

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App),
}).$mount('#app')
