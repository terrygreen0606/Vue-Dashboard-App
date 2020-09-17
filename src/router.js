import Vue from 'vue'
import Router from 'vue-router'
import cookies from 'js-cookie'
import store from './store'
import { guardRoute } from '@/shared/management'

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/pages',
      component: () => import('@/views/pages/Index'),
      children: [
        {
          name: 'Lock',
          path: 'lock',
          component: () => import('@/views/pages/Lock'),
        },
        {
          name: 'Register',
          path: 'register',
          component: () => import('@/views/pages/Register'),
        },
      ],
    },
    {
      path: '/login',
      component: () => import('@/views/pages/Index'),
      children: [
        {
          name: 'Login',
          path: '',
          component: () => import('@/views/pages/Login'),
        },
      ],
    },
    {
      path: '/admin-workflow',
      component: () => import('@/views/pages/Index'),
      children: [
        {
          name: 'Admin Workflow',
          path: '',
          component: () => import('@/views/pages/AdminWorkflow'),
        },
      ],
    },
    // Doc Viewer
    {
      name: 'Docx Viewer',
      path: '/docxviewer',
      component: () => import('@/views/dashboard/Companies/view/DocxViewer.vue'),
    },
    {
      path: '/',
      component: () => import('@/views/dashboard/Index'),
      children: [
        // Dashboard
        {
          name: 'Dashboard',
          path: '',
          component: () => import('@/views/dashboard/Dashboard/Index'),
        },
        // Root level
        {
          name: 'Companies',
          path: 'companies',
          component: () => import('@/views/dashboard/Companies/Index'),
        },
        {
          name: 'Company / VRP Express',
          path: 'companies/:id/vrpexpress',
          component: () => import('@/views/dashboard/Companies/view/VRPImport'),
        },
        {
          name: 'Company Detail',
          path: 'companies/:id',
          redirect: 'companies/:id/general',
          component: () => import('@/views/dashboard/Companies/view/Index'),
          children: [
            {
              name: 'Company / General Information',
              path: 'general',
              component: () => import('@/views/dashboard/Companies/view/General'),
            },
            {
              name: 'Company / Addresses',
              path: 'addresses',
              component: () => import('@/views/dashboard/Companies/view/Addresses'),
            },
            {
              name: 'Company / VRP',
              path: 'plan',
              component: () => import('@/views/dashboard/Companies/view/VRP'),
            },
            {
              name: 'Company / Capabilities',
              path: 'smff',
              component: () => import('@/views/dashboard/Companies/view/SMFF'),
            },
            {
              name: 'Company / Affiliates',
              path: 'affiliates',
              component: () => import('@/views/dashboard/Companies/view/Affiliates'),
            },
            {
              name: 'Company / Individuals',
              path: 'individuals',
              component: () => import('@/views/dashboard/Companies/view/Individuals'),
            },
            {
              name: 'Company / Vessels',
              path: 'vessels',
              component: () => import('@/views/dashboard/Companies/view/Vessels'),
            },
            {
              name: 'Company / Files',
              path: 'files',
              component: () => import('@/views/dashboard/Companies/view/Files'),
            },
            {
              name: 'Company / Notes',
              path: 'notes',
              component: () => import('@/views/dashboard/Companies/view/Notes'),
            },
          ],
        },
        {
          name: 'Vessels',
          path: 'vessels',
          component: () => import('@/views/dashboard/Vessels/Index'),
        },
        {
          name: 'Vessel / VRP Express',
          path: 'vessels/:id/vrpexpress',
          component: () => import('@/views/dashboard/Vessels/view/VRPImport'),
        },
        {
          name: 'Vessel Detail',
          path: 'vessels/:id',
          redirect: 'vessels/:id/general',
          component: () => import('@/views/dashboard/Vessels/view/Index'),
          children: [
            {
              name: 'Vessel / General Information',
              path: 'general',
              component: () => import('@/views/dashboard/Vessels/view/General'),
            },
            {
              name: 'Vessel / Construction',
              path: 'construction',
              component: () => import('@/views/dashboard/Vessels/view/Construction'),
            },
            {
              name: 'Vessel / Capabilities',
              path: 'smff',
              component: () => import('@/views/dashboard/Vessels/view/SMFF'),
            },
            {
              name: 'Vessel / AIS Data',
              path: 'ais',
              component: () => import('@/views/dashboard/Vessels/view/AIS'),
            },
            {
              name: 'Vessel / Notes',
              path: 'notes',
              component: () => import('@/views/dashboard/Vessels/view/Notes'),
            },
            {
              name: 'Vessel / Files',
              path: 'files',
              component: () => import('@/views/dashboard/Vessels/view/Files'),
            },
          ],
        },
        {
          name: 'Individuals',
          path: 'individuals',
          component: () => import('@/views/dashboard/Individuals/Index'),
        },
        {
          name: 'Individual Detail',
          path: 'individuals/:id',
          redirect: 'individuals/:id/general',
          component: () => import('@/views/dashboard/Individuals/view/Index'),
          children: [
            {
              name: 'Individual / General Information',
              path: 'general',
              component: () => import('@/views/dashboard/Individuals/view/General'),
            },
            {
              name: 'Individual / Address',
              path: 'address',
              component: () => import('@/views/dashboard/Individuals/view/Address'),
            },
            {
              name: 'Individual / Capabilities',
              path: 'smff',
              component: () => import('@/views/dashboard/Individuals/view/SMFF'),
            },
            {
              name: 'Individual / Files',
              path: 'files',
              component: () => import('@/views/dashboard/Individuals/view/Files'),
            },
            {
              name: 'Individual / Notes',
              path: 'notes',
              component: () => import('@/views/dashboard/Individuals/view/Notes'),
            },
            {
              name: 'Individual / Change Password',
              path: 'change-password',
              component: () => import('@/views/dashboard/Individuals/view/ChangePassword'),
            },
          ],
        },
        {
          name: 'System Reports',
          path: 'reports',
          redirect: 'reports/db-changes',
          component: () => import('@/views/dashboard/Reports/Index'),
          children: [
            {
              name: 'DB Changes',
              path: 'db-changes',
              component: () => import('@/views/dashboard/Reports/DBChanges'),
            },
            {
              name: 'Active Vessels',
              path: 'active-vessels',
              component: () => import('@/views/dashboard/Reports/ActiveVessels'),
            },
            {
              name: 'No-Contract Companies',
              path: 'no-contract-companies',
              component: () => import('@/views/dashboard/Reports/NoContractCompanies'),
            },
            {
              name: 'Schedule Reports',
              path: 'schedule',
              component: () => import('@/views/dashboard/Reports/Schedule'),
            },
          ],
        },
        {
          name: 'User Permissions',
          path: 'user-permissions',
          component: () => import('@/views/dashboard/UserPermissions'),
        },
        {
          name: 'COP Map',
          path: 'map',
          component: () => import('@/views/dashboard/Map/Index'),
        },
        {
          name: 'Latest AIS Positions',
          path: 'latest-ais-positions',
          component: () => import('@/views/dashboard/LatestAISPositions'),
        },
        {
          name: 'Fleets',
          path: 'fleets',
          component: () => import('@/views/dashboard/Fleets/Fleets'),
        },
        {
          name: 'Fleets Detail',
          path: 'fleets/:id',
          component: () => import('@/views/dashboard/Fleets/VesselInformation'),
        },
        {
          name: 'Geographic Annexes',
          path: 'gsa',
          component: () => import('@/views/dashboard/GSA/Index'),
        },
        {
          name: 'Alerts System',
          path: 'alerts',
          component: () => import('@/views/dashboard/Alert'),
        },
        {
          name: 'AIS',
          path: 'ais',
          component: () => import('@/views/dashboard/Ais'),
        },
        {
          name: 'Tabletop Exercise',
          path: 'ttx',
          component: () => import('@/views/dashboard/TabletopExercise'),
        },
        {
          name: 'Remote Assessment',
          path: 'race',
          component: () => import('@/views/dashboard/RemoteAssessment'),
        },
      ],
    },
    {
      path: '*',
      component: () => import('@/views/pages/Index'),
      children: [
        {
          name: '404 Error',
          path: '',
          component: () => import('@/views/pages/Error'),
        },
      ],
    },
  ],
})

export default router

router.beforeEach((to, from, next) => {
  if (to.path !== '/login' && !cookies.get('x-access-token')) {
    return next('/login')
  }

  if (to.path === '/login' && cookies.get('x-access-token')) {
    return next('/')
  }

  if (to.path !== '/login') {
    if (store.state.authentication.role) {
      if (!guardRoute(to.name, store.state.authentication.role.id)) return next('/')
    } else {
      store.watch(state => state.authentication.role, (role) => {
        if (role && !guardRoute(to.name, role.id)) return next('/')
      })
    }
  }
  next()
})
