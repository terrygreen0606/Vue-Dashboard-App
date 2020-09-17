import { Control, easyBar, easyButton } from 'leaflet'
import 'leaflet-fullscreen/dist/Leaflet.fullscreen'
import 'leaflet-easybutton/src/easy-button'

export const controls = {
  data () {
    return {
      checksInLayerOptions: {
        items: [
          {
            name: 'grid',
            icon: 'mdi-grid',
            label: 'Show Grid',
          },
        ],
      },
      viewOptions: {
        name: 'View Options',
        icon: 'mdi-card-search',
        items: [
          {
            name: 'individualsGroup',
            icon: 'mdi-alpha-i-circle',
            label: 'Group Individuals',
          },
          {
            name: 'companiesGroup',
            icon: 'mdi-alpha-c-circle',
            label: 'Group Companies',
          },
        ],
      },
      checksInOthers: {
        name: 'Tools',
        icon: 'mdi-tools',
        items: [
          {
            name: 'drop',
            icon: 'mdi-eyedropper',
            label: 'Drop Lat/Lng',
          },
        ],
      },
      controlsInLeafletEasyBar: [
        {
          name: 'vessels',
          icon: 'mdi-ferry',
          onTitle: 'Show Vessels',
          offTitle: 'Hide Vessels',
        },
        {
          name: 'vesselsGroup',
          icon: 'vessel',
          onTitle: 'Group Vessels',
          offTitle: 'Ungroup Vessels',
        },
        {
          name: 'individuals',
          icon: 'mdi-account',
          onTitle: 'Show Individuals',
          offTitle: 'Hide Individuals',
        },
        {
          name: 'individualsGroup',
          icon: 'individual',
          onTitle: 'Group Individuals',
          offTitle: 'Ungroup Individuals',
        },
        {
          name: 'companies',
          icon: 'mdi-domain',
          onTitle: 'Show Companies',
          offTitle: 'Hide Companies',
        },
        {
          name: 'companiesGroup',
          icon: 'company',
          onTitle: 'Group Companies',
          offTitle: 'Ungroup Companies',
        },
      ],
      rulerControlBtn: [
        {
          name: 'ruler',
          icon: 'mdi-pencil-ruler',
          onTitle: 'Enable Ruler',
          offTitle: 'Disalbe Ruler',
        },
      ],
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.addControls()
    })
  },
  methods: {
    addControls () {
      this.map.addControl(new Control.Fullscreen({ position: 'topright' }))
      easyBar(
        this.controlsInLeafletEasyBar.map(control => {
          const states = [
            {
              stateName: `on-${control.name}`,
              icon: control.name.includes('Group')
                ? `<img src="${control.icon}_on.png" width="28" height="28" />`
                : `<i class="mdi ${control.icon}" style="font-size:18px;"></i>`,
              title: control.onTitle,
              onClick: (btn, map) => {
                this.displayOptions[control.name] = true
                btn.state(`off-${control.name}`)
              },
            },
            {
              stateName: `off-${control.name}`,
              icon: control.name.includes('Group')
                ? `<img src="${control.icon}_off.png" width="28" height="28" />`
                : `<i class="mdi ${control.icon}" style="font-size:18px; color: #00a3e4"></i>`,
              title: control.offTitle,
              onClick: (btn, map) => {
                this.displayOptions[control.name] = false
                btn.state(`on-${control.name}`)
              },
            },
          ]
          return easyButton({
            states: this.displayOptions[control.name] ? states.reverse() : states,
          })
        }),
        { position: 'topright' },
      ).addTo(this.map)

      easyBar(
        this.rulerControlBtn.map(control => {
          const states = [
            {
              stateName: `on-${control.name}`,
              icon: control.name.includes('Group')
                ? `<img src="${control.icon}_on.png" width="28" height="28" />`
                : `<i class="mdi ${control.icon}" style="font-size:18px;"></i>`,
              title: control.onTitle,
              onClick: (btn, map) => {
                this.displayOptions[control.name] = true
                btn.state(`off-${control.name}`)
              },
            },
            {
              stateName: `off-${control.name}`,
              icon: control.name.includes('Group')
                ? `<img src="${control.icon}_off.png" width="28" height="28" />`
                : `<i class="mdi ${control.icon}" style="font-size:18px; color: #00a3e4"></i>`,
              title: control.offTitle,
              onClick: (btn, map) => {
                this.displayOptions[control.name] = false
                btn.state(`on-${control.name}`)
              },
            },
          ]
          return easyButton({
            states: this.displayOptions[control.name] ? states.reverse() : states,
          })
        }),
        { position: 'topright' },
      ).addTo(this.map)
    },
  },
}
