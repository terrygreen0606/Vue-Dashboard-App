<template>
  <v-container
    fluid
    tag="section"
  >
    <base-material-tabs
      v-model="mainTab"
      background-color="transparent"
      centered
      icons-and-text
      show-arrows
    >
      <v-tab
        v-for="(tab, i) in mainTabs"
        :key="i"
      >
        {{ tab.name }}
        <v-icon v-text="tab.icon" />
      </v-tab>

      <v-tabs-items
        v-model="mainTab"
        class="transparent"
      >
        <v-tab-item>
          <base-material-card
            inline
            icon="mdi-human-greeting"
            title="Welcome"
            class="px-5 py-3"
          >
            <p class="headline">
              Introduction to Donjon-SMIT
            </p>
            <h2 class="my-3 grey--text lighten-3">
              We are glad to have you here!
            </h2>
            <p class="subtitle-1">
              Donjon-SMIT is a unique provider of Oil Pollution Act of 1990 (OPA-90) maritime vessel emergency response services in which the nearly 200 years of corporate expertise of DONJON and SMIT is combined. The joint venture provides marine salvage, lightering and firefighting services for compliance and response related to OPA-90 requirements.
            </p>
            <p class="subtitle-1">
              Donjon-SMIT was formed to assist vessel owners seeking compliance with the demanding emergency preparedness and response components of OPA-90 and related state regulations. OPA-90 was enacted in 1990 to prevent and/or mitigate tank vessel oil pollution. In subsequent years, the scope of OPA-90 has expanded to include non-tank vessels.
            </p>
            <p class="subtitle-1">
              Welcome to our online portal where you can view your vessels' Vessel Response Plan Salvage and Marine Firefighting information.
            </p>
          </base-material-card>
        </v-tab-item>
        <v-tab-item>
          <base-material-card
            inline
            icon="mdi-update"
            title="24/7 Response"
            class="px-5 py-3"
          >
            <p class="headline">
              24/7 Emergency Response
            </p>
            <h1 class="mb-3">
              Email Us Here:
              <a href="mailto:admin@donjon-smit.com">admin@donjon-smit.com</a>
            </h1>
            <h1 class="mb-3">
              OPA-90 Response:
              <a href="tel:+1 703 299 0081">+1 703 299 0081</a>
            </h1>
          </base-material-card>
        </v-tab-item>
        <v-tab-item>
          <base-material-card
            inline
            icon="mdi-email"
            title="Contact Us"
            class="px-5 py-3"
          >
            <p class="headline">
              Let's Talk
            </p>
            <h2 class="my-3 grey--text lighten-3">
              Donjon-Smit is the leader of Salvage and Marine Firefighting response.
            </h2>
            <h1 class="mb-3">
              Address
            </h1>
            <p class="subtitle-1">
              15402 Vantage Parkway East
            </p>
            <p class="subtitle-1">
              Suite 316
            </p>
            <p class="subtitle-1">
              Houston, Texas 77032 USA
            </p>
            <h1 class="mb-3">
              Email Us Here:
              <a href="mailto:admin@donjon-smit.com">admin@donjon-smit.com</a>
            </h1>
            <h1 class="mb-3">
              OPA-90 Response:
              <a href="tel:+1 703 299 0081">+1 703 299 0081</a>
            </h1>
          </base-material-card>
        </v-tab-item>
        <v-tab-item>
          <base-material-card
            inline
            icon="mdi-help-circle-outline"
            title="Help Center"
            class="px-5 py-3"
          >
            <p class="headline">
              Help Center
            </p>
            <h2 class="my-3 grey--text lighten-3">
              Need assistance with your Vessel Response Plan? Donjon-SMIT portal access issues?
            </h2>
            <h1 class="mb-3">
              Email Us Here:
              <a href="mailto:admin@donjon-smit.com">admin@donjon-smit.com</a>
            </h1>
            <h1 class="mb-3">
              OPA-90 Response:
              <a href="tel:+1 703 299 0081">+1 703 299 0081</a>
            </h1>
          </base-material-card>
        </v-tab-item>
      </v-tabs-items>
    </base-material-tabs>
  </v-container>
</template>

<script>
  export default {
    name: 'ExternalDashboard',
    data: () => ({
      mainTab: 0,
      mainTabs: [
        { name: 'Welcome', icon: 'mdi-human-greeting' },
        { name: '24/7 Response', icon: 'mdi-update' },
        { name: 'Contact US', icon: 'mdi-email' },
        { name: 'Help Center', icon: 'mdi-help-circle-outline' },
      ],
    }),
  }
</script>
