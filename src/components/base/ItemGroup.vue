<template>
  <v-list-group
    v-model="item.active"
    :group="group"
    :prepend-icon="item.icon"
    :sub-group="subGroup"
    append-icon="mdi-menu-down"
    :color="barColor !== 'rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.7)' ? 'white' : 'grey darken-1'"
    class="group-items"
  >
    <template v-slot:activator>
      <v-list-item-icon
        v-if="text"
        class="group-text"
        v-text="computedText"
      />

      <v-list-item-avatar
        v-if="item.img"
        class="align-self-center"
        style="width: 34px; height: 34px; min-width: 34px; margin: 0;"
      >
        <v-img
          :src="item.img"
        />
      </v-list-item-avatar>

      <v-list-item-avatar
        v-else-if="item.avatar"
        class="align-self-center"
        color="grey"
        style="width: 34px; height: 34px; min-width: 34px; margin: 0;"
      >
        <v-icon>mdi-account</v-icon>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title v-text="item.title" />
      </v-list-item-content>
    </template>

    <template v-for="(child, i) in children">
      <base-item-sub-group
        v-if="child.children"
        :key="`sub-group-${i}`"
        :item="child"
      />
      <base-item
        v-else
        :key="`item-${i}`"
        :item="child"
        text
      />
    </template>
  </v-list-group>
</template>

<script>
  // Utilities
  import kebabCase from 'lodash/kebabCase'
  import { mapState } from 'vuex'

  export default {
    name: 'ItemGroup',

    inheritAttrs: false,

    props: {
      item: {
        type: Object,
        default: () => ({
          avatar: undefined,
          group: undefined,
          title: undefined,
          children: [],
        }),
      },
      subGroup: {
        type: Boolean,
        default: false,
      },
      text: {
        type: Boolean,
        default: false,
      },
    },

    computed: {
      ...mapState(['barColor']),
      children () {
        return this.item.children.map(item => ({
          ...item,
          to: !item.to ? undefined : `${this.item.group}/${item.to}`,
        }))
      },
      computedText () {
        if (!this.item || !this.item.title) return ''

        let text = ''

        this.item.title.split(' ').forEach(val => {
          text += val.substring(0, 1)
        })

        return text
      },
      group () {
        return this.genGroup(this.item.children)
      },
    },

    methods: {
      genGroup (children) {
        return children
          .filter(item => item.to)
          .map(item => {
            const parent = item.group || this.item.group
            let group = `${parent}/${kebabCase(item.to)}`

            if (item.children) {
              group = `${group}|${this.genGroup(item.children)}`
            }

            return group
          }).join('|')
      },
    },
  }
</script>

<style>
.v-list-group__activator p {
  margin-bottom: 0;
}

.group-items {
  margin-bottom: 8px;
}

#core-navigation-drawer .v-list-group.group-items .v-list-group__header .v-list-group__header__prepend-icon {
  margin: 12px 0 !important;
  margin-left: 0 !important;
}
</style>
