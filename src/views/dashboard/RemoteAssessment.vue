<template>
  <v-container
    id="remote-assessment"
    class="fill-height justify-center"
    tag="section"
  >
    <v-row
      align="center"
      class="text-center"
      justify="center"
    >
      <v-col
        class="mb-10"
        cols="12"
      >
        <template>
          <h1 class="header-title">
            Remote Assessment and Consultations (RACE)
          </h1>
          <div class="display-1 font-weight-light black--text text--lighten-1">
            Vessels are requested to confirm that they are clear on the information being requested in the Casualty Information Sheet(s) provided below, which contains vessel specific information we would require in the event of an actual incident. Depending on the scenario type from the VRP's shipboard emergency procedures that you are using for this drill, please confirm understanding of (referenced in the checklist) the General Casualty Information and/or Fire/Explosion Casualty Information Sheets.
          </div>
        </template>
      </v-col>
      <v-col
        v-for="(race, i) in races"
        :key="i"
        class="d-flex"
        cols="12"
        sm="6"
        md="4"
      >
        <base-material-card
          image
          color="white"
          hover-reveal
        >
          <template v-slot:image>
            <v-img
              :src="race.img"
              height="300"
            />
          </template>
          <template>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  color="grey"
                  icon
                  :href="race.downloadLink"
                  :download="race.name"
                  v-on="on"
                >
                  <v-icon>
                    {{ race.icon }}
                  </v-icon>
                </v-btn>
              </template>
              Download
            </v-tooltip>
          </template>
          <v-card-text class="text-center">
            <h4 class="display-2 font-weight-light mb-3 black--text">
              {{ race.title }}
            </h4>
          </v-card-text>
          <v-card-text
            v-text="race.text"
          />
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      races: [
        {
          icon: 'mdi-cloud-download',
          title: 'RACE - Checklist',
          text: 'Frequency: Triennially per plan holder while operating in U.S. waters, including the EEZ; otherwise, upon entry into U.S. waters. The remote assessment and consultation exercise is not required for vessels operating outside U.S. waters.',
          img: require('@/assets/card-race.jpg'),
          name: 'race_checklist.pdf',
          downloadLink: require('@/assets/pdf/race_checklist.pdf'),
        },
        {
          icon: 'mdi-cloud-download',
          title: 'General Casualty Information Sheet',
          text: 'Contains the vessel specific information we would require in the event of an actual incident for all the VRP\'s shipboard emergency procedures except fire/explosion.',
          img: require('@/assets/card-general.jpg'),
          name: 'GG_A_RACE-GENERAL.pdf',
          downloadLink: require('@/assets/pdf/GG_A_RACE-GENERAL.pdf'),
        },
        {
          icon: 'mdi-cloud-download',
          title: 'Fire/Explosion Casualty Information Sheet',
          text: 'Contains the vessel specific information and other data we would require in the event of an actual incident for the VRP\'s shipboard emergency procedures for fire/explosion.',
          img: require('@/assets/card-fire.jpg'),
          name: 'GG_A_RACE-FIRE.pdf',
          downloadLink: require('@/assets/pdf/GG_A_RACE-FIRE.pdf'),
        },
      ],
    }),
  }
</script>

<style lang="sass">
  .v-card--plan
    .v-avatar
      border-radius: 50%
      border: 1px solid #E5E5E5
  .v-btn--contained
    border-radius: 30px
    border: 1px solid #E5E5E5
  .header-title
    font-size: 38px
    font-weight: 300
    color: #3c4858
    margin-bottom: 40px
  .v-card__text
    color: #999999
    font-weight: 300
    font-size: 14px
</style>
