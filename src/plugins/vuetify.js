import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import i18n from '@/i18n'
import '@/sass/overrides.sass'

Vue.use(Vuetify)

const theme = {
  primary: '#00A3E4',
  secondary: '#023B68',
  accent: '#FFF900',
  error: '#C32F27',
  info: '#000000',
  success: '#1E972D',
  warning: '#FF8500',
}

export default new Vuetify({
  lang: {
    t: (key, ...params) => i18n.t(key, params),
  },
  theme: {
    themes: {
      dark: theme,
      light: theme,
    },
  },
})
