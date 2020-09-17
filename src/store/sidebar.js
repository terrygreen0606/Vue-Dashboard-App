import MobileDetect from 'mobile-detect'

const md = new MobileDetect(window.navigator.userAgent)

function getIsMobile () {
  return !!md.mobile() || !!md.phone()
}

export const sidebar = {
  state: {
    barColor: 'rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)',
    barImage: require('@/assets/sidebar-1.jpg'),
    drawer: null,
    isMobile: getIsMobile(),
  },
  mutations: {
    SET_BAR_IMAGE (state, payload) {
      state.barImage = payload
    },
    SET_DRAWER (state, payload) {
      state.drawer = payload
    },
    SET_SCRIM (state, payload) {
      state.barColor = payload
    },
  },
}
