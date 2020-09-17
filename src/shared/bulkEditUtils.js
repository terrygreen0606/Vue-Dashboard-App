/* eslint-disable */
export const splitMultiDropdownValues = valueString => {
  return valueString
    ? valueString.split(';').map(i => Number(i)).filter(i => Number.isFinite(i))
    : []
}

export const combineMultiDropdownValues = valueArray => {
  return valueArray && valueArray.length > 0
    ? valueArray.join(';')
    : null
}

export const formatNumber = input => {
  if (input === '') return null
  return Number(input)
}

export const getColumnsFromVessels = vessels => vessels.map(({
  company,
  name,
  imo,
  official_number,
  vessel_type_id,
  societies,
  dead_weight,
  pi,
  insurers,
  deck_area,
  oil_tank_volume,
  oil_group,
  providers,
  tanker,
  active,
  id,
}) => [
  company.id,
  name,
  imo,
  official_number,
  vessel_type_id,
  combineMultiDropdownValues(societies),
  dead_weight,
  combineMultiDropdownValues(pi),
  combineMultiDropdownValues(insurers),
  deck_area,
  oil_tank_volume,
  oil_group,
  combineMultiDropdownValues(providers),
  tanker ? 'YES' : 'NO',
  active ? 'YES' : 'NO',
  id,
])

export const getColumnsFromCompanies = compaines => compaines.map(({
  name,
  plan_number,
  qi_id,
  // dpa_name,
  // dpa_phone,
  // dpa_email,
  active,
  networks_active,
  country,
  id,
}) => [
  name,
  plan_number,
  qi_id,
  // dpa_name,
  // dpa_phone,
  // dpa_email,
  active ? 'YES' : 'NO',
  networks_active ? 'YES' : 'NO',
  country,
  id,
])

export const getColumnsFromUsers = users => users.map(({
  title,
  first_name,
  last_name,
  primary_company_id: company_id,
  occupation,
  role_ids,
  email,
  mobile_number,
  id,
}) => [
  title,
  first_name,
  last_name,
  company_id,
  occupation,
  role_ids[0], // data issue: second param is invalid
  email,
  mobile_number,
  id,
])
