<template>
  <v-container
    fluid
    tag="section"
  >
    <v-row>
      <v-col
        cols="12"
      >
        <div
          id="chartdiv"
          style="height: 25vw"
        />
      </v-col>
      <v-col
        cols="12"
        lg="4"
      >
        <h3 class="display-2 mb-8">
          {{ header }}
        </h3>
        <p
          v-for="(paragraph, i) in paragraphs"
          :key="i"
        >
          {{ paragraph }}
        </p>
      </v-col>
      <v-col
        cols="12"
        sm="6"
        lg="4"
      >
        <v-card>
          <v-card-text>
            <base-subheading subheading="ATLANTIC AREA" />

            <v-expansion-panels
              v-model="atlanticAreaPanel"
              accordion
              flat
              hover
              class="gsa-accordion"
            >
              <v-expansion-panel
                v-for="district in Object.keys(atlanticArea)"
                :key="district"
              >
                <v-expansion-panel-header>
                  U.S. Coast Guard District #{{ district }}
                </v-expansion-panel-header>

                <v-expansion-panel-content>
                  <a
                    v-for="(sector, i) in atlanticArea[district]"
                    :key="i"
                    :href="links[district][i]"
                    target="_blank"
                  >
                    <p>
                      Sector {{ sector }}
                    </p>
                  </a>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        sm="6"
        lg="4"
      >
        <v-card>
          <v-card-text>
            <base-subheading subheading="PACIFIC AREA" />

            <v-expansion-panels
              v-model="pacificAreaPanel"
              accordion
              flat
              hover
              class="gsa-accordion"
            >
              <v-expansion-panel
                v-for="district in Object.keys(pacificArea)"
                :key="district"
              >
                <v-expansion-panel-header>
                  U.S. Coast Guard District #{{ district }}
                </v-expansion-panel-header>

                <v-expansion-panel-content>
                  <a
                    v-for="(sector, i) in pacificArea[district]"
                    :key="i"
                    :href="links[district][i]"
                    target="_blank"
                  >
                    <p>
                      Sector {{ sector }}
                    </p>
                  </a>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { cotpMap } from './mixins/cotpMap'

  export default {
    name: 'GSA',

    mixins: [cotpMap],

    data: () => ({
      header: 'Geographic Specific Annexes',
      paragraphs: [
        "DONJON-SMIT's geographic specific annexes, incorporated by reference into vessel response plans, can be downloaded here.",
        'The USCG has determined that incorporating resource listings for contracted SMFF services into VRP GSAs by reference is an acceptable method of providing the required information in the required VRP updates as long as the most recent version of the resource providers SMFF core GSA that is on file with the USCG is used',
        'Vessel owners/operators may reference USCG-accepted SMFF core GSAs in their VRP updates in lieu of submitting detailed salvage and marine firefighting resource information in the VRP, but only for those resource providers with whom they have established contracts and funding agreements in accordance with 33 CFR Part 155 Subpart I.',
      ],
      atlanticArea: {
        1: ['Boston', 'Northern New England', 'Southeastern New England', 'New York', 'Long Island Sound'],
        5: ['Delaware Bay', 'Hampton Roads', 'Maryland-National Capital Region', 'North Carolina'],
        7: ['Miami', 'Charleston', 'Jacksonville', 'San Juan', 'St. Petersburg', 'Key West'],
        8: ['Mobile', 'New Orleans', 'Houston-Galveston', 'Corpus Christi', 'Upper Mississippi River', 'Lower Mississippi River', 'Ohio Valley'],
        9: ['Buffalo', 'Lake Michigan', 'Detroit', 'Sault Ste. Marie'],
      },
      pacificArea: {
        11: ['Los Angeles-Long Beach', 'San Diego', 'San Francisco'],
        13: ['Puget Sound', 'Columbia River'],
        14: ['Honolulu', 'Guam'],
        17: ['Juneau', 'Anchorage'],
      },
      links: {
        1: ['./gsa/Boston.pdf', './gsa/N NE.pdf', './gsa/SE NE.pdf', './gsa/NY.pdf', './gsa/LI Snd.pdf'],
        5: ['./gsa/Del Bay.pdf', './gsa/Hmp Rd.pdf', './gsa/Balt.pdf', './gsa/NC.pdf'],
        7: ['./gsa/Mia.pdf', './gsa/Chltn.pdf', './gsa/Jack.pdf', './gsa/O-SJ.pdf', './gsa/St Pte.pdf', './gsa/Ky W.pdf'],
        8: ['./gsa/Mob.pdf', './gsa/NO.pdf', './gsa/Hous.pdf', './gsa/Co Ch.pdf', './gsa/U Miss.pdf', './gsa/L Miss.pdf', './gsa/Ohio V.pdf'],
        9: ['./gsa/Buf.pdf', './gsa/L Mich.pdf', './gsa/Det.pdf', './gsa/SSM.pdf'],
        11: ['./gsa/LALB.pdf', './gsa/SD.pdf', './gsa/SF.pdf'],
        13: ['./gsa/Pg Sd.pdf', './gsa/Prtlnd.pdf'],
        14: ['./gsa/O-Haw.pdf', './gsa/O-Guam.pdf'],
        17: ['./gsa/O-Jun.pdf', './gsa/O-W AK.pdf'],
      },
    }),
  }
</script>

<style lang="sass">
  .gsa-accordion
    .v-expansion-panel-header
      border-bottom: 1px solid lightgray
      padding: 25px 10px 5px 0px
      font-size: 1.0625rem
    .v-expansion-panel--active > .v-expansion-panel-header
      min-height: 48px
      color: #c32f27
    .v-expansion-panel-content__wrap
      padding: 15px 5px 5px
      font-size: 1rem
      a
        text-decoration: none

  #chartdiv
    width: 100%
    height: 300px
</style>
