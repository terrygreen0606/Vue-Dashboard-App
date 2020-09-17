<template>
  <v-menu
    bottom
    offset-y
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        class="toolbar-icon-button"
        dark
        icon
        v-on="on"
      >
        <v-icon class="mx-0">
          mdi-map-legend
        </v-icon>
      </v-btn>
    </template>
    <v-list
      class="cop-map-menu"
      dark
    >
      <v-list-item>
        <span class="mx-auto">Legend</span>
      </v-list-item>
      <v-list-group
        v-for="group in legendList"
        :key="group.id"
      >
        <template v-slot:activator>
          <v-icon>{{ group.icon }}</v-icon>
          <v-list-item>{{ group.name }}</v-list-item>
        </template>
        <v-list-group
          v-for="subgroup in group.subgroups"
          :key="subgroup.id"
          no-action
          sub-group
        >
          <template v-slot:activator>
            <v-list-item class="px-0">
              <v-list-item-title>
                {{ subgroup.name }}
              </v-list-item-title>
              <v-list-item-icon v-if="subgroup.icon.includes('mdi')">
                <v-icon>
                  {{ subgroup.icon }}
                </v-icon>
              </v-list-item-icon>
              <v-list-item-avatar
                v-else
                class="mr-1"
                tile
                size="20"
              >
                <v-img
                  :alt="subgroup.id"
                  :src="require(`@/assets/icons/${subgroup.icon}.png`)"
                />
              </v-list-item-avatar>
            </v-list-item>
          </template>
          <v-list-item
            v-for="icon in subgroup.icons"
            :key="icon.id"
            class="px-11"
          >
            <v-list-item-avatar
              tile
              size="25"
            >
              <v-img
                :alt="icon.id"
                :src="require(`@/assets/icons/${group.id}/${icon.id}.png`)"
              />
            </v-list-item-avatar>
            <v-list-item-content>
              {{ icon.name }}
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list-group>
    </v-list>
  </v-menu>
</template>

<script>
  export default {
    data () {
      return {
        subGroupsForIc: [
          {
            id: 'salvage',
            icon: 'salvage',
            name: 'Salvage',
            icons: [
              {
                id: 's_salvage',
                name: 'Salvage',
              },
              {
                id: 's_remote_assessment_and_consultation',
                name: 'Remote Assessment and Consultation',
              },
              {
                id: 's_begin_assessment_of_structural_stability',
                name: 'Begin Assessment of Structural Stability',
              },
              {
                id: 's_onsite_salvage_assessment',
                name: 'On-site Salvage Assessment',
              },
              {
                id: 's_assessment_of_structural_stability',
                name: 'Assessment of Structural Stability',
              },
              {
                id: 's_hull_and_bottom_survey',
                name: 'Hull/Buttom Survey',
              },
              {
                id: 's_emergency_towing',
                name: 'Emergency Towing',
              },
              {
                id: 's_salvage_plan',
                name: 'Salvage Plan',
              },
              {
                id: 's_external_emergency_transfer_operations',
                name: 'External Emergency Transfer Operations',
              },
              {
                id: 's_emergency_lightering',
                name: 'Emergency Lightering',
              },
              {
                id: 's_other_refloating_methods',
                name: 'Other Refloating Methods',
              },
              {
                id: 's_making_temporary_repairs',
                name: 'Making Temporary Repairs',
              },
              {
                id: 's_diving_services_support',
                name: 'Diving Services Support',
              },
              {
                id: 's_special_salvage_operations_plan',
                name: 'Special Salvage Operations Plan',
              },
              {
                id: 's_subsurface_product_removal',
                name: 'Subsurface Product Removal',
              },
              {
                id: 's_heavy_lift',
                name: 'Heavy Lift',
              },
            ],
          },
          {
            id: 'firefighting',
            icon: 'mdi-fire',
            name: 'Firefighting',
            icons: [
              {
                id: 'mff_firefighting',
                name: 'Marine Firefighting',
              },
              {
                id: 'mff_remote_assessment_and_consultation',
                name: 'Remote Assessment and Consultation',
              },
              {
                id: 'mff_onsite_fire_assessment',
                name: 'On-site Fire Assessment',
              },
              {
                id: 'mff_external_firefighting_teams',
                name: 'External Firefighting Teams',
              },
              {
                id: 'mff_external_vessel_firefighting_systems',
                name: 'External Vessel Firefighting Systems',
              },
            ],
          },
          {
            id: 'others',
            icon: 'mdi-vector-difference-ba',
            name: 'Others',
            icons: [
              {
                id: 'all_services',
                name: 'All Services',
              },
              {
                id: 'donjon_location',
                name: 'Donjon Location',
              },
              {
                id: 'undefined',
                name: 'Undefined',
              },
            ],
          },
        ],
      }
    },
    computed: {
      legendList () {
        return [
          {
            id: 'vessels',
            icon: 'mdi-ferry',
            name: 'Vessels',
            subgroups: [
              {
                id: 'status_icons',
                icon: 'mdi-navigation',
                name: 'Status Icons',
                icons: [
                  {
                    id: '0_under_way_using_eng',
                    name: 'Under Way Using Engine',
                  },
                  {
                    id: '1_at_anchor',
                    name: 'At Anchor',
                  },
                  {
                    id: '2_not_under_command',
                    name: 'Not Under Command',
                  },
                  {
                    id: '3_restricted_maneuver',
                    name: 'Restricted Maneuverability',
                  },
                  {
                    id: '4_constrained_by_her_draught',
                    name: 'Constrained By Her Draught',
                  },
                  {
                    id: '5_moored',
                    name: 'Moored',
                  },
                  {
                    id: '6_aground',
                    name: 'Aground',
                  },
                  {
                    id: '7_engaged_in_fishing',
                    name: 'Engaged in Fishing',
                  },
                  {
                    id: '8_under_way_sailing',
                    name: 'Under Way Sailing',
                  },
                  {
                    id: '11_power_driven_vessel_towing_astern',
                    name: 'Power-Driven Vessel Towing Astern',
                  },
                  {
                    id: '12_power_driven_vessel_pushing_ahead_or_towing_alongside',
                    name: 'Power-Driven Vessel Pushing Ahead/Towing Alongside',
                  },
                  {
                    id: 'no_ais',
                    name: 'Undefined',
                  },
                ],
              },
              {
                id: 'types_circles',
                icon: 'mdi-circle',
                name: 'Types Circles',
                icons: [
                  {
                    id: '0_not_available',
                    name: 'Not Availalbe',
                  },
                  {
                    id: '1_reserved_for_future_use',
                    name: 'Reserved For Future Use',
                  },
                  {
                    id: '3_special_category',
                    name: 'Special Category',
                  },
                  {
                    id: '3a_anchor_handling_fire_fighting',
                    name: 'Anchor handling/Fire Fighting',
                  },
                  {
                    id: '3a_tug',
                    name: 'Tug',
                  },
                  {
                    id: '3b_fishing',
                    name: 'Fishing',
                  },
                  {
                    id: '4_high_speed_craft',
                    name: 'High Speed Craft',
                  },
                  {
                    id: '5_special_category',
                    name: 'Special Category',
                  },
                  {
                    id: '6_passenger',
                    name: 'Passenger',
                  },
                  {
                    id: '7_Cargo_vessels',
                    name: 'Cargo Vessels',
                  },
                  {
                    id: '8_tankers',
                    name: 'Tankers',
                  },
                  {
                    id: '9_other_types_of_ship',
                    name: 'Other Types of Ship',
                  },
                  {
                    id: 'undefined',
                    name: 'Undefined',
                  },
                ],
              },
            ],
          },
          {
            id: 'individuals',
            icon: 'mdi-account',
            name: 'Individuals',
            subgroups: [...this.subGroupsForIc],
          },
          {
            id: 'companies',
            icon: 'mdi-domain',
            name: 'Companies',
            subgroups: [...this.subGroupsForIc],
          },
        ]
      },
    },
  }
</script>

<style lang="scss" scoped>
</style>
