export const OIL_GROUP = ['I', 'II', 'III', 'IV', 'V']
export const TRUE_FALSE_SOURCE = ['YES', 'NO']

export const BULK_EDITOR_COLUMNS = {
  vessels: ({
    companyItems,
    vesselTypeItems,
    societyItems,
    piItems,
    insurerItems,
    providerItems,
  }) => ({
    company: {
      type: 'dropdown',
      title: 'COMPANY',
      source: companyItems,
      autocomplete: true,
    },
    vessel_name: {
      type: 'text',
      title: 'VESSEL NAME',
    },
    imo: {
      type: 'text',
      title: 'IMO #',
    },
    official: {
      type: 'numeric',
      title: 'OFFICIAL #',
    },
    vessel_type: {
      type: 'dropdown',
      title: 'VESSEL TYPE',
      source: vesselTypeItems,
      autocomplete: true,
    },
    class: {
      type: 'dropdown',
      title: 'CLASS',
      source: societyItems,
      autocomplete: true,
    },
    dead_weight: {
      type: 'text',
      title: 'DWT',
    },
    pi: {
      type: 'dropdown',
      title: 'P&I CLUB',
      source: piItems,
      autocomplete: true,
    },
    insurers: {
      type: 'dropdown',
      title: 'H&M INSURER',
      source: insurerItems,
      autocomplete: true,
    },
    deck_area: {
      type: 'text',
      title: 'DECK AREA',
    },
    oil_tank_volumen: {
      type: 'text',
      title: 'Largest Cargo Tank',
    },
    oil_group: {
      type: 'dropdown',
      title: 'Oil Group',
      source: OIL_GROUP,
      autocomplete: true,
    },
    damage_stability: {
      type: 'dropdown',
      title: 'Damage Stability',
      source: providerItems,
      autocomplete: true,
    },
    tank: {
      type: 'dropdown',
      title: 'Tank',
      source: TRUE_FALSE_SOURCE,
    },
    djs_active: {
      type: 'dropdown',
      title: 'DJS Active',
      source: TRUE_FALSE_SOURCE,
    },
    id: {
      type: 'numeric',
      title: 'ID',
      readOnly: true,
    },
  }),
  companies: ({ countryItems, qiItems }) => ({
    company_name: {
      type: 'text',
      title: 'Company',
      width: '300px',
    },
    plan_number: {
      type: 'numeric',
      title: 'Plan Number',
    },
    qi_id: {
      type: 'dropdown',
      title: 'Qualified Individual',
      source: qiItems,
      autocomplete: true,
      width: '300px',
    },
    // will come soon - dpa_name, dpa_phone, dpa_email
    // dpa_name: {
    //   type: 'text',
    //   title: 'DPA Name',
    // },
    // dpa_phone: {
    //   type: 'text',
    //   title: 'DPA Phone',
    // },
    // dpa_email: {
    //   type: 'text',
    //   title: 'DPA Email',
    // },
    djs_active: {
      type: 'dropdown',
      title: 'DJS Active',
      source: TRUE_FALSE_SOURCE,
    },
    networks_active: {
      type: 'dropdown',
      title: 'Network Active',
      source: TRUE_FALSE_SOURCE,
    },
    country: {
      type: 'dropdown',
      title: 'Country',
      readOnly: true,
      source: countryItems,
      width: '250px',
    },
    id: {
      type: 'numeric',
      title: 'ID',
      readOnly: true,
    },
  }),
  users: ({ companies = [], roles = [] }) => ({
    title: {
      type: 'text',
      title: 'Title',
    },
    first_name: {
      type: 'text',
      title: 'First Name',
    },
    last_name: {
      type: 'text',
      title: 'Last Name',
    },
    company: {
      type: 'dropdown',
      title: 'Company',
      source: companies,
      autocomplete: true,
      width: '300px',
    },
    occupation: {
      type: 'text',
      title: 'Occupation',
    },
    roles: {
      type: 'dropdown',
      title: 'User Role',
      source: roles,
      autocomplete: true,
    },
    email: {
      type: 'text',
      title: 'Email',
      width: '250px',
    },
    phone_number: {
      type: 'numeric',
      title: 'Mobile Number',
      width: '200px',
    },
    id: {
      type: 'numeric',
      title: 'ID',
      readOnly: true,
    },
  }),
}

export const MAIN_COMPANY = [
  {
    text: 'Company',
    value: 'name',
    showOnMobile: true,
  },
  {
    text: 'Plan',
    value: 'plan_number',
    showOnMobile: true,
  },
  {
    text: 'Status',
    value: 'djs_coverage',
    showOnMobile: true,
    sortable: false,
  },
  {
    text: 'Individuals',
    icon: 'mdi-account-multiple-outline',
    value: 'individuals',
    showOnMobile: false,
    sortable: false,
  },
  {
    text: 'DJS',
    value: 'djs_vessels',
    badge: 'mdi-ferry',
    showOnMobile: false,
    sortable: false,
  },
  {
    text: 'VRP',
    value: 'vrp_vessels',
    badge: 'mdi-ferry',
    showOnMobile: false,
    sortable: false,
    internal: true,
  },
  {
    text: 'Country',
    value: 'country',
    icon: 'mdi-flag',
    showOnMobile: true,
    sortable: false,
  },
  {
    text: 'Action',
    value: '',
    showOnMobile: true,
    sortable: false,
  },
]

export const days = [
  { text: 'Sunday', value: 1 },
  { text: 'Monday', value: 2 },
  { text: 'Tuesday', value: 3 },
  { text: 'Wednesday', value: 4 },
  { text: 'Thursday', value: 5 },
  { text: 'Friday', value: 6 },
  { text: 'Saturday', value: 7 },
]

export const dates = () => {
  const dates = []
  let i = 1
  while (i < 29) {
    dates.push({ text: i, value: i })
    i++
  }
  return dates
}
