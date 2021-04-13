<template>
  <div>
    <template v-if="isBusy">
      <div class="text-center text-secondary">
        <b-spinner class="align-middle" />
        <strong>Loading...</strong>
      </div>
    </template>
    <template v-if="!isBusy">
      <b-container>
        <b-row>
          <b-col cols="9">
            <p class="overview-description">
              Project description - lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. <a href="#">Link</a>
            </p>
          </b-col>
          <b-col>
            <b-button block class="download-button" variant="outline-dark">
              Download Data
            </b-button>
            <b-col />
          </b-col>
        </b-row>

        <hr class="my-4">

        <b-row>
          <b-col cols="7">
            <b-form-group label="Filter:">
              <b-form-radio-group
                id="filterGroup"
                v-model="filterOptionSelected"
                :options="filterOptions"
                name="filterOptionGroup"
                stacked
                @change="onFilterOptionSelect"
              />
            </b-form-group>

            <!-- <b-form-input list="filter-list" placeholder="All publishing organizations" class="mb-3" />
            <datalist id="filter-list">
              <option v-for="org in reportingOrgs" :key="org.text">
                {{ org.text }}
              </option>
            </datalist> -->

            <!-- :state="organisation.length > 0 ? true : null" -->
            <v-select
              v-if="filterOptionSelected==='org'"
              class="filter-select filter-select-org mb-3"
              :options="reportingOrgs"
              :get-option-key="option => option.value"
              :get-option-label="option => option.text"
              :reduce="option => option.value"
              placeholder="All publishing organisations"
            />

            <v-select
              v-if="filterOptionSelected==='country'"
              class="filter-select filter-select-country mb-3"
              :options="countries"
              :get-option-key="option => option.value"
              :get-option-label="option => option.text"
              :reduce="option => option.value"
              placeholder="All recipient regions/countries"
            />

            <v-select
              v-if="filterOptionSelected==='sector'"
              class="filter-select filter-select-sector mb-3"
              :options="sectors"
              :get-option-key="option => option.value"
              :get-option-label="option => option.text"
              :reduce="option => option.value"
              label="text"
              placeholder="All sectors"
            />

            <div class="quick-filter-list">
              Quick filters:
              <ul class="horizontal-list d-inline">
                <li v-for="filter in quickFilters" :key="filter.name">
                  <a href="#">{{ filter.name }}</a> |
                </li>
              </ul>
            </div>
          </b-col>
          <b-col>
            <b-row>
              <b-col>
                Filter for COVID-19 related transactions
                <b-badge pill variant="dark" class="info-icon p-0">
                  ?
                </b-badge>:
              </b-col>
              <b-col>
                Loose / Strict
                <!-- <b-button-group size="sm">
                  <b-button
                    v-for="(btn, idx) in buttons"
                    :key="idx"
                    :pressed.sync="btn.state"
                    variant="primary"
                  >
                    {{ btn.caption }}
                  </b-button>
                </b-button-group> -->
              </b-col>
            </b-row>
            <hr class="my-3">
            <b-row>
              <b-col>
                Only show humanitarian transactions
                <b-badge pill variant="dark" class="info-icon p-0">
                  ?
                </b-badge>:
              </b-col>
              <b-col>No / Yes</b-col>
            </b-row>
            <hr class="my-3">
            <p class="small text-muted">
              xx,xxx transactions excluded. Explanation/definition about the Icon here lorem ipsum dolor sit amet, consectetur adipiscing elit,  lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <p class="small text-muted">
              All reported transactions are as of X date
            </p>
          </b-col>
        </b-row>

        <hr class="my-4">

        <h2 class="my-4">
          <b>{{ Number(activities.length).toLocaleString() }}</b> transactions by <b>all publishing orgs</b>
        </h2>
        <h2 class="header">
          Key Figures
        </h2>

        <b-row>
          <b-col>
            <div class="key-figure-container">
              <DoughnutChart
                :doughnut-chart-data="commitmentsSummary"
                :colors="commitmentColors"
              />
              <div class="key-figure-breakdown w-100 ml-4 mr-5">
                <h3>
                  Total Commitments (USD)
                  <b-badge pill variant="dark" class="info-icon p-0">
                    ?
                  </b-badge>
                </h3>
                <div class="key-figure-num">
                  x.x B
                </div>
                <b-form-select
                  id="commitmentsSelect"
                  v-model="commitmentSelected"
                  class="form-select pl-0 my-3"
                  size="sm"
                  :options="keyFigureFilter"
                />

                <b-table borderless small class="summary-table mr-5 mb-0" :fields="fields" :items="commitmentsTable">
                  <template #cell(color)="data">
                    <div class="color-key" :style="'background-color: ' + commitmentColors[data.index]" />
                  </template>
                  <template #custom-foot>
                    <tr>
                      <td colspan="2 pt-3">
                        <span class="small text-muted">
                          Mar 05, 2021 | IATI | <a href="#">DATA</a>
                        </span>
                      </td>
                      <td colspan="pt-3">
                        (USDm)
                      </td>
                    </tr>
                  </template>
                </b-table>
              </div>
            </div>
          </b-col>
          <b-col>
            <div class="key-figure-container">
              <DoughnutChart
                :doughnut-chart-data="spendingSummary"
                :colors="spendingColors"
              />
              <div class="key-figure-breakdown w-100 ml-4 mr-5">
                <h3>
                  Total Spending (USD) <b-badge pill variant="dark" class="info-icon p-0">
                    ?
                  </b-badge>
                </h3>
                <div class="key-figure-num">
                  x.x B
                </div>
                <b-form-select
                  id="spendingSelect"
                  v-model="spendingSelected"
                  class="form-select pl-0 my-3"
                  size="sm"
                  :options="keyFigureFilter"
                />

                <b-table borderless small class="summary-table mr-5 mb-0" :fields="fields" :items="spendingTable">
                  <template #cell(color)="data">
                    <div class="color-key" :style="'background-color: ' + spendingColors[data.index]" />
                  </template>
                  <template #custom-foot>
                    <tr>
                      <td colspan="2 pt-3">
                        <span class="small text-muted">
                          Mar 05, 2021 | IATI | <a href="#">DATA</a>
                        </span>
                      </td>
                      <td colspan="pt-3">
                        (USDm)
                      </td>
                    </tr>
                  </template>
                </b-table>
              </div>
            </div>
          </b-col>
        </b-row>

        <h2 class="header">
          Cumulative Total Commitments and Spending Over Time
        </h2>

        <TimeseriesChart
          :timeseries-chart-data="commitmentsSummary"
        />
      </b-container>
    </template>
  </div>
</template>

<script>
import axios from 'axios'
import config from '../nuxt.config'
import DoughnutChart from '~/components/DoughnutChart'
import TimeseriesChart from '~/components/TimeseriesChart'
export default {
  components: {
    DoughnutChart,
    TimeseriesChart
  },
  data () {
    return {
      title: config.head.title,
      filterOptionSelected: 'org',
      filterOptions: [
        { text: 'By Publishing Organization', value: 'org' },
        { text: 'By Recipient Region / Country', value: 'country' },
        { text: 'By Sector', value: 'sector' }
      ],
      commitmentSelected: 'country',
      spendingSelected: 'country',
      keyFigureFilter: [
        { value: 'country', text: 'By Recipient Countries' },
        { value: 'org', text: 'By Publishing Orgs' }
      ],
      buttons: [
        { caption: 'Loose', state: true },
        { caption: 'Strict', state: false }
      ],
      quickFilters: [
        { name: 'Asian Development Bank' },
        { name: 'Inter-American Development Bank' },
        { name: 'Netherlands - Ministry of Foreign Affairs' },
        { name: 'OCHA' },
        { name: 'UNDP' },
        { name: 'USAID' },
        { name: 'WFP' }
      ],
      fields: [
        { key: 'color', label: 'Color' },
        'item',
        'value'
      ],
      commitmentColors: ['#007CE1', '#3393E2', '#65ABE3', '#98C3E4', '#CADAE5', '#EEE'],
      spendingColors: ['#C6382E', '#DC4E44', '#F2645A', '#F0948F', '#EDC4C3', '#EEE'],
      commitmentsTable: [
        { item: 'Developing countries, ...', value: 1027.42 },
        { item: 'India', value: 903.36 },
        { item: 'Afghanistan', value: 704.28 },
        { item: 'Pakistan', value: 601.27 },
        { item: 'Egypt', value: 595.21 },
        { item: 'Other', value: 2714.21 }
      ],
      spendingTable: [
        { item: 'India', value: 1027.42 },
        { item: 'Developing countries, ...', value: 903.36 },
        { item: 'Philippines (the)', value: 704.28 },
        { item: 'Afghanistan', value: 601.27 },
        { item: 'Pakistan', value: 595.21 },
        { item: 'Other', value: 2714.21 }
      ]
    }
  },
  computed: {
    isBusy () {
      return this.$store.state.originalActivityData.length === 0
    },
    activityUsedCodelists () {
      return this.$store.state.activityUsedCodelists
    },
    codelists () {
      return this.$store.state.codelists
    },
    m49Codelists () {
      return this.$store.state.m49Codelists
    },
    countries () {
      return this.activityUsedCodelists.countriesRegions.reduce((summary, countryRegion) => {
        summary.push({ value: countryRegion, text: this.getCountryName({ code: countryRegion }) })
        return summary
      }, []).sort((a, b) =>
        a.text < b.text ? -1 : 1
      )
    },
    reportingOrgs () {
      return this.activityUsedCodelists.reportingOrgs.reduce((summary, reportingOrg) => {
        const reportingOrgName = this.activityUsedCodelists.reportingOrgNames[reportingOrg]
        if (reportingOrgName !== '') { summary.push({ value: reportingOrg, text: reportingOrgName }) }
        return summary
      }, []).sort((a, b) =>
        a.text < b.text ? -1 : 1
      )
    },
    sectors () {
      return this.activityUsedCodelists.sectors.reduce((summary, sector) => {
        summary.push({ value: sector, text: this.getSectorName({ code: sector }) })
        return summary
      }, []).sort((a, b) =>
        a.text < b.text ? -1 : 1
      )
    },
    originalActivityData () {
      return this.$store.state.originalActivityData
    },
    activities () {
      return this.originalActivityData
    },
    commitmentsSummary () {
      return [15.9, 14, 10.9, 9.9, 7, 43]
    },
    spendingSummary () {
      return [15.9, 14, 10.9, 9.9, 7, 43]
    },
    urls () {
      return {
        DATA_URL: 'https://ocha-dap.github.io/covid19-data/activities.json',
        ACTIVITY_TRANSACTIONS_DATA_URL: 'https://ocha-dap.github.io/covid19-data/traceability/transactions_sector_country.json',
        COUNTRIES_CODELIST_URL: 'https://codelists.codeforiati.org/api/json/en/Country.json',
        REGIONS_CODELIST_URL: 'https://codelists.codeforiati.org/api/json/en/Region.json',
        SECTORS_CODELIST_URL: 'https://codelists.codeforiati.org/api/json/en/Sector.json',
        M49_CODELIST_URL: 'https://ocha-dap.github.io/covid19-data/m49_countries_simplified.json'
      }
    }
  },
  mounted () {
    if (Object.values(this.codelists.countries).length === 0) {
      // this.$nuxt.$loading.start()
      this.setup()
    }
  },
  methods: {
    async setup () {
      await axios.get(`${this.urls.COUNTRIES_CODELIST_URL}`).then((response) => {
        const data = response.data
        this.$store.commit('setCodelistsCountry', data.data.reduce((countries, country) => {
          countries[country.code] = country.name
          return countries
        }, {}))
      })
      await axios.get(`${this.urls.REGIONS_CODELIST_URL}`).then((response) => {
        const data = response.data
        this.$store.commit('setCodelistsCountry', data.data.reduce((countries, region) => {
          countries[region.code] = region.name
          return countries
        }, this.$store.state.codelists.countries))
      })
      await axios.get(`${this.urls.SECTORS_CODELIST_URL}`).then((response) => {
        const data = response.data
        this.$store.commit('setCodelistsSector', data.data.reduce((sectors, sector) => {
          sectors[sector.code] = sector.name
          return sectors
        }, {}))
      })
      await axios.get(`${this.urls.M49_CODELIST_URL}`).then((response) => {
        const data = response.data
        this.$store.commit('setM49Codelists', data)
      })
      this.loadData()
    },
    async loadData () {
      const _data = await axios.get('https://ocha-dap.github.io/covid19-data/activities.json')
      const activities = _data.data.activities
      this.$store.commit('setOriginalActivityData', activities)
      this.$store.commit('setActivityUsedCodelists', _data.data.codelists)
      this.$nuxt.$loading.finish()
    },
    updateRouter () {
      // this.$router.push({ name: 'overview', query: this.urlQuery })
    },
    getCountryName (recipientCountry) {
      if (recipientCountry.code === '') { return 'Unspecified' }
      const _countryName = this.codelists.countries[recipientCountry.code]
      return _countryName || `Unknown: ${recipientCountry.code}`
    },
    getSectorName (sector) {
      const _sectorName = this.codelists.sectors[sector.code]
      return _sectorName ? `${sector.code}: ${_sectorName}` : `${sector.code}: Unknown`
    },
    onFilterOptionSelect (selected) {
      this.filterOptionSelected = selected
    }
  }
}
</script>

<style lang='scss'>
  .download-button {
    border-color: #000;
    color: #000;
    font-family: 'Gotham Bold', sans-serif;
    font-size: 14px;
    padding: 13px 16px;
    &:hover {
      background-color: #000;
      border-color: #000;
      color: #FFF;
    }
  }
  .key-figure-container {
    border-bottom: 1px solid #CCC;
    display: flex;
    flex-direction: row;
    margin-bottom: 28px;
    padding: 20px 0;
  }
  .key-figure-num {
    font-family: 'Gotham Book', sans-serif;
    font-size: 42px;
    line-height: 49px;
  }
  .summary-table {
    font-size: 14px;
    thead {
      display: none;
    }
    td {
      padding: 0 8px 0 0;
      vertical-align: middle;
      &:last-child {
        text-align: right;
      }
    }
  }
  .color-key {
    height: 12px;
    width: 12px;
  }
  .quick-filter-list {
    font-size: 14px;
    line-height: 18px;
  }
  .filter-select {
    .vs__dropdown-toggle {
      padding: 14px;
    }
    .vs__open-indicator {
      cursor: pointer;
      fill: #000;
    }
    .vs__search {
      font-family: 'Gotham Bold', sans-serif;
    }
  }
  .col-form-label {
    font-weight: bold;
  }
</style>
