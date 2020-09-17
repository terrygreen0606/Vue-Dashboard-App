<template>
  <v-container>
    <v-list
      v-if="poc"
      dense
    >
      <v-list-item
        v-for="item in pocItems"
        :key="item.subtitle"
      >
        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ item.subtitle }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-alert
      v-else
      class="py-0"
      type="info"
      color="red"
    >
      No POC specified
    </v-alert>
    <v-btn
      block
      color="indigo"
      dark
      :to="`/${type}/${companyId}`"
      target="_blank"
    >
      Edit Company POC
    </v-btn>
  </v-container>
</template>

<script>
  export default {
    props: {
      poc: Object,
      type: String,
      companyId: Number,
    },
    computed: {
      pocItems () {
        return [
          {
            title: this.poc.first_name,
            subtitle: 'First Name',
          },
          {
            title: this.poc.last_name,
            subtitle: 'Last Name',
          },
          {
            title: this.poc.email,
            subtitle: 'E-mail',
          },
          {
            title: this.poc.home_number,
            subtitle: 'Home Number',
          },
          {
            title: this.poc.mobile_number,
            subtitle: 'Mobile Number',
          },
        ].filter(item => item.title)
      },
    },
  }
</script>

<style scoped></style>
