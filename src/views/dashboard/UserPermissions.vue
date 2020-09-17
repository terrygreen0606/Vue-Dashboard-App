<template>
  <v-container
    fluid
    tag="section"
  >
    <base-material-card
      color="primary"
      icon="mdi-cog"
      inline
      title="User Permissions"
      class="px-5 py-3 mb-5"
    >
      <v-progress-linear
        v-if="loading"
        indeterminate
      />
      <v-container v-else>
        <v-card-title>
          <span class="headline">
            Role
          </span>
          <v-spacer />
          <v-select
            v-model="activeRole"
            :items="roles"
            class="role-select"
            item-text="name"
            item-value="id"
          />
          <v-btn
            text
            class="primary ml-3"
            @click="updatePermissionsFromApi"
          >
            Update
          </v-btn>
        </v-card-title>
        <v-divider class="my-3" />
        <v-simple-table v-if="components.length">
          <template v-slot:default>
            <thead>
              <tr>
                <th>
                  Modules
                </th>
                <th
                  v-for="(header, i) in headers"
                  :key="i"
                >
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">
                        {{ header.icon }}
                      </v-icon>
                    </template>
                    <span>
                      {{ header.tooltipText }}
                    </span>
                  </v-tooltip>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="component in components"
                :key="component.id"
              >
                <td>
                  {{ component.name }}
                </td>
                <td
                  v-for="value in values"
                  :key="value"
                >
                  <v-checkbox
                    v-model="component.permissions"
                    :value="value"
                    hide-details
                    @change="() => { updated = false }"
                  />
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-container>
    </base-material-card>
    <confirm-dialog
      :show="confirmDialogModel"
      @close:dialog="() => { confirmDialogModel = false }"
      @discard:changes="() => { next() }"
    />
  </v-container>
</template>

<script>
  import axios from 'axios'
  import { mapActions } from 'vuex'

  export default {
    components: {
      ConfirmDialog: () => import('@/views/dashboard/components/ConfirmDialog.vue'),
    },

    data: () => ({
      roles: [],
      components: [],
      activeRole: null,
      loading: 0,
      headers: [
        {
          icon: 'mdi-plus',
          tooltipText: 'CREATE',
        },
        {
          icon: 'mdi-eye',
          tooltipText: 'READ',
        },
        {
          icon: 'mdi-pencil',
          tooltipText: 'UPDATE',
        },
        {
          icon: 'mdi-delete',
          tooltipText: 'DELETE',
        },
      ],
      values: ['C', 'R', 'U', 'D'],
      updated: true,
      next: null,
      confirmDialogModel: false,
    }),

    watch: {
      activeRole: function () {
        this.getComponentsFromApi()
      },
    },

    mounted () {
      this.getRolesFromApi()
    },

    beforeRouteLeave (to, from, next) {
      if (this.updated) {
        next()
      } else {
        this.next = next
        this.confirmDialogModel = true
      }
    },

    methods: {
      ...mapActions({
        showSnackBar: 'showSnackBar',
      }),

      getComponentsFromApi () {
        this.loading++
        axios.get(`permissions/components/${this.activeRole}`)
          .then(res => {
            this.components = res.data
          })
          .catch(err => {
            this.components = []
            this.showSnackBar({
              text: `${err} while downloading permission component`,
              color: 'error',
            })
          })
          .finally(() => {
            this.loading--
          })
      },

      getRolesFromApi () {
        this.loading++
        axios.get('permissions/roles')
          .then(res => {
            this.roles = res.data
            this.activeRole = res.data[0].id
          })
          .catch(err => {
            this.showSnackBar({
              text: `${err} while downloading Permission Roles data`,
              color: 'error',
            })
          })
          .finally(() => {
            this.loading--
          })
      },

      updatePermissionsFromApi () {
        this.loading++
        axios
          .post(
            'permissions/update',
            {
              roleId: this.activeRole,
              components: this.components,
            },
          )
          .then(res => {
            this.updated = true
            this.showSnackBar({
              text: 'Success on saving new permissions',
              color: 'success',
            })
          })
          .catch(err => {
            this.showSnackBar({
              text: `${err} while saving new permissions`,
              color: 'error',
            })
          })
          .finally(() => {
            this.loading--
          })
      },
    },
  }
</script>

<style lang="sass" scoped>
  .role-select
    max-width: 200px
  .v-input--selection-controls
    margin-top: 0
</style>
