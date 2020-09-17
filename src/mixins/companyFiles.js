export const companyFiles = {
  data () {
    return {
      categories: {
        'Schedule A': [
          {
            name: 'SCHEDULE A Non-Tank',
            code: 'schedule-a-non-tank',
            filename: 'schedule-a-non-tank',
            count: 0,
            generated: true,
            hasAddress: false,
          },
          {
            name: 'SCHEDULE A Tanker',
            code: 'schedule-a-tanker',
            filename: 'schedule-a-tanker',
            count: 0,
            generated: true,
            hasAddress: false,
          },
          {
            name: 'SCHEDULE A Combined',
            code: 'schedule-a-combined',
            filename: 'schedule-a-combined',
            count: 0,
            generated: true,
            hasAddress: false,
          },
        ],
        'Pre-fire Plan Certification': [
          {
            name: 'Multiple Vessels Pre-fire Plan Certification',
            code: 'multiple-vessels-pre-fire-plan-certification',
            filename: 'multiple-vessels-pre-fire-plan-certification',
            count: 0,
            generated: true,
            hasAddress: true,
          },
          {
            name: 'Single Vessel Pre-fire Plan Certification',
            code: 'single-vessel-pre-fire-plan-certification',
            filename: 'single-vessel-pre-fire-plan-certification',
            count: 0,
            generated: true,
            hasAddress: true,
          },
        ],
        'SMFF Coverage Certification': [
          {
            name: 'SMFF Coverage Certification',
            code: 'smff-coverage-certification',
            filename: 'smff-coverage-certification',
            count: 0,
            generated: true,
            hasAddress: false,
          },
        ],
        'Contracts, Written Consents, and Agreements': [
          {
            name: 'Written Consent Agreement - Group V',
            code: 'group-v-consent-letter',
            filename: 'written-consent-agreement-group-v',
            count: 0,
            generated: true,
            hasAddress: true,
          },
          {
            name: 'Written Consent Agreement - Non Tank Vessels below 250 bbls',
            code: 'letter-of-intent-non-tank-tank-vessels-below-250bbls',
            filename: 'written-consent-agreement-non-tank-vessels-below-250-bbls',
            count: 0,
            generated: true,
            hasAddress: true,
          },
          {
            name: 'Written Consent Agreement - Non Tank Vessels below 2500 bbls',
            code: 'letter-of-intent-non-tank-tank-vessels',
            filename: 'written-consent-agreement-non-tank-vessels-below-2500-bbls',
            count: 0,
            generated: true,
            hasAddress: true,
          },
          {
            name: 'OPA-90 Client Contract',
            code: 'contracts',
            count: 0,
            generated: false,
            hasAddress: false,
          },
          {
            name: 'OPA-90 Response Asset Agreement',
            code: 'opa-90-response-asset-agreement',
            count: 0,
            generated: false,
            hasAddress: false,
          },
          {
            name: 'NASA Response Asset Agreement',
            code: 'nasa-response-asset-agreement',
            count: 0,
            generated: false,
            hasAddress: false,
          },
        ],
        Annex: [
          {
            name: 'Tank SMFF Annex',
            code: 'tank-smff-annex',
            filename: 'tank-smff-annex',
            count: 0,
            generated: false,
            hasAddress: false,
          },
          {
            name: 'Non-Tank SMFF Annex',
            code: 'nt-smff-annex', // nt-smff-annex
            filename: 'nt-smff-annex',
            count: 0,
            generated: false,
            hasAddress: false,
          },
          {
            name: 'Combined SMFF Annex',
            code: 'combined-smff-annex',
            filename: 'combined-smff-annex',
            count: 0,
            generated: false,
            hasAddress: false,
          },
          {
            name: 'AA-Vessel Specific Page',
            code: 'aa-vessel-specific',
            filename: 'aa-vessel-specific',
            count: 0,
            generated: true,
            hasAddress: false,
          },
        ],
        'Damage Stability': [
          {
            name: 'Damage Stability Coverage Certification',
            code: 'damage-stability-coverage-certification',
            filename: 'damage-stability-coverage-certification',
            count: 0,
            generated: false,
            hasAddress: false,
          },
        ],
        'Shipboard Spill Mitigation Procedures': [
          {
            name: 'Shipboard Spill Mitigation Procedures',
            code: 'shipboard-spill-mitigation-procedures',
            count: 0,
            generated: false,
            hasAddress: false,
          },
        ],
      },
    }
  },
  methods: {
    getDirFromCode (code) {
      let ret
      Object.keys(this.categories).forEach(cat => {
        const temp = this.categories[cat].find(dir => dir.code === code)
        if (temp) {
          ret = temp
        }
      })
      return ret
    },
  },
}
