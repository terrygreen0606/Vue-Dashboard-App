import * as L from 'leaflet'
import 'leaflet.icon.glyph'

export const tileProviders = [
  {
    name: 'Maritime',
    attribution: '&copy; CDT 2019',
    url: 'https://api.mapbox.com/styles/v1/darkomk/cju7fjs4s2kl41golvx7ufzer/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamFucnVsczEiLCJhIjoiY2swcGlhNXpwMDBzNTNvcmcwZDQxcDB6cyJ9.w3WTQktdZ2nMziZtXNoRKQ',
    visible: true,
    layerType: 'base',
  },
  {
    name: 'Basic',
    url: 'https://api.maptiler.com/maps/basic/{z}/{x}/{y}.png?key=eUVkdgmowfvr2xtlx4Bn',
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    visible: false,
  },
  {
    name: 'Satellite',
    url: 'https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=eUVkdgmowfvr2xtlx4Bn',
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    visible: false,
    layerType: 'base',
  },
  {
    name: 'Streets',
    url: 'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=eUVkdgmowfvr2xtlx4Bn',
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    visible: false,
    layerType: 'base',
  },
  {
    name: 'Topo',
    url: 'https://api.maptiler.com/maps/topo/{z}/{x}/{y}.png?key=eUVkdgmowfvr2xtlx4Bn',
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    visible: false,
    layerType: 'base',
  },
  {
    name: 'Bright',
    url: 'https://api.maptiler.com/maps/bright/{z}/{x}/{y}.png?key=eUVkdgmowfvr2xtlx4Bn',
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    visible: false,
    layerType: 'base',
  },
  {
    name: 'Dark',
    url: 'https://api.maptiler.com/maps/darkmatter/{z}/{x}/{y}.png?key=eUVkdgmowfvr2xtlx4Bn',
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    visible: false,
    layerType: 'base',
  },
  {
    name: 'Positron',
    url: 'https://api.maptiler.com/maps/positron/{z}/{x}/{y}.png?key=eUVkdgmowfvr2xtlx4Bn',
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    visible: false,
    layerType: 'base',
  },
]

/**
 * @return {L.icon} : vessel icon
 *
 * @param {string} vesselType : the COLOR of the vessel icon
 * @param {number} aisStatusId : the SHAPE of the vessel icon
 * @param {number} size : the SIZE of the icon - for track icons size = 22
 */
export const getVesselIcon = (vesselType, aisStatusId, size = 16) => {
  const validTypes = ['0', '1', '2', '3', '3a', '3b', '4', '5', '5a', '6', '7', '8', '9']
  if (!vesselType || !validTypes.includes(vesselType.toString())) {
    vesselType = 'Unspecified'
  }
  if (!validateAISStatusId(aisStatusId)) {
    aisStatusId = 'No_AIS'
  }
  return L.icon({
    iconUrl: require('@/assets/icons/vessels/' + vesselType.toString() + '/' + aisStatusId.toString() + '.png'),
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, 0],
    className: 'default-vessel',
  })
}

export const validateAISStatusId = aisStatusId => {
  const validStatusIdS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 11, 12]
  return validStatusIdS.includes(aisStatusId)
}

export const toggleSelection = (selecteds, item) => {
  const arr = [...selecteds]
  const id = arr.indexOf(item)
  id >= 0 ? arr.splice(id, 1) : arr.push(item)
  return arr
}

export const toggleLayer = (map, layer, value) => {
  if (value && layer && !map.hasLayer(layer)) map.addLayer(layer)
  else if (!value && map.hasLayer(layer)) map.removeLayer(layer)
}

export const itemsServices = [
  {
    id: 'donjon_location',
    name: 'Donjon Location',
    db: 0,
  },
  {
    id: 'smit_location',
    name: 'SMIT Location',
    db: 0,
  },
  {
    id: 'all_services',
    name: 'All Services',
    db: 0,
  },
  {
    id: 's_salvage',
    name: 'Salvage',
    db: 0,
  },
  {
    id: 's_remote_assessment_and_consultation',
    name: 'Remote assessment and consultation',
    db: 1,
  },
  {
    id: 's_begin_assessment_of_structural_stability',
    name: 'Begin assessment of structural stability',
    db: 1,
  },
  {
    id: 's_onsite_salvage_assessment',
    name: 'On-site salvage assessment',
    db: 1,
  },
  {
    id: 's_assessment_of_structural_stability',
    name: 'Assessment of structural stability',
    db: 1,
  },
  {
    id: 's_hull_and_bottom_survey',
    name: 'Hull and bottom survey',
    db: 1,
  },
  {
    id: 's_emergency_towing',
    name: 'Emergency towing',
    db: 1,
  },
  {
    id: 's_salvage_plan',
    name: 'Salvage plan',
    db: 1,
  },
  {
    id: 's_external_emergency_transfer_operations',
    name: 'External emergency transfer operations',
    db: 1,
  },
  {
    id: 's_emergency_lightering',
    name: 'Emergency lightering',
    db: 1,
  },
  {
    id: 's_other_refloating_methods',
    name: 'Other refloating methods',
    db: 1,
  },
  {
    id: 's_making_temporary_repairs',
    name: 'Making temporary repairs',
    db: 1,
  },
  {
    id: 's_diving_services_support',
    name: 'Diving services support',
    db: 1,
  },
  {
    id: 's_special_salvage_operations_plan',
    name: 'Special salvage operations plan',
    db: 1,
  },
  {
    id: 's_subsurface_product_removal',
    name: 'Subsurface product removal',
    db: 1,
  },
  {
    id: 's_heavy_lift',
    name: 'Heavy lift',
    db: 1,
  },
  {
    id: 'm_firefighting',
    name: 'Firefighting',
    db: 0,
  },
  {
    id: 'mff_remote_assessment_and_consultation',
    name: 'Remote assessment and consultation',
    db: 1,
  },
  {
    id: 'mff_onsite_fire_assessment',
    name: 'On-site fire assessment',
    db: 1,
  },
  {
    id: 'mff_external_firefighting_teams',
    name: 'External firefighting teams',
    db: 1,
  },
  {
    id: 'mff_external_vessel_firefighting_systems',
    name: 'External vessel firefighting systems',
    db: 1,
  },
  {
    id: 'acd_logistics_asset',
    name: 'Logistics Asset',
    db: 1,
  },
]

export const prettyDate = lastUpdate => {
  if (!lastUpdate) return null
  const today = new Date()
  const startDate = new Date(lastUpdate)
  today.setMinutes(today.getMinutes() + today.getTimezoneOffset())
  const secs = Math.floor((today.getTime() - startDate.getTime()) / 1000)
  if (secs < 60) return secs + ' sec(s) ago'
  if (secs < 3600) return Math.floor(secs / 60) + ' min(s) ago'
  if (secs < 86400) return Math.floor(secs / 3600) + ' hour(s) ago'
  if (secs < 604800) return Math.floor(secs / 86400) + ' day(s) ago'
  return 'more than a week ago'
}

export const toDegreesMinutesAndSeconds = coordinate => {
  const absolute = Math.abs(coordinate)
  const degrees = Math.floor(absolute)
  const minutesNotTruncated = (absolute - degrees) * 60
  const minutes = Math.floor(minutesNotTruncated)
  const seconds = Math.floor((minutesNotTruncated - minutes) * 60)
  return `${degrees}° ${minutes}' ${seconds}''`
}

export const prettyDateForm = lastUpdate => {
  const today = new Date()
  const startDate = new Date(lastUpdate)
  today.setMinutes(today.getMinutes() + today.getTimezoneOffset())
  const secs = Math.floor((today.getTime() - startDate.getTime()) / 1000)
  if (secs < 60) return secs + ' sec(s) ago'
  if (secs < 3600) return Math.floor(secs / 60) + ' min(s) ago'
  if (secs < 86400) return Math.floor(secs / 3600) + ' hour(s) ago'
  if (secs < 604800) return Math.floor(secs / 86400) + ' day(s) ago'
  return 'more than a week ago'
}

export const getNetworkName = networkCodes => {
  return networkCodes.includes('ns') || networkCodes.includes('npnc') ? 'NASA Capabilites'
    : networkCodes.includes('opa_90') ? 'OPA-90 Capabilities'
    : 'Capabilities'
}

export const sleep = async ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
