<template>
  <div>
    <b-container>
      <b-row>
        <b-col cols="9">
          <p class="mb-4">
            Project description - lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>
        </b-col>
        <b-col>
          <b-button href="https://ocha-dap.github.io/hdx-scraper-iati-viz/flows.csv" block class="download-button" variant="outline-dark">
            Download All Data
          </b-button>
        </b-col>
      </b-row>
    </b-container>
    <template v-if="isBusy">
      <div class="custom-loader text-center text-secondary mt-5">
        <b-spinner class="align-middle" />
        <strong>Loading...</strong>
      </div>
    </template>
    <template
      v-if="!isBusy">
      <b-container>
        <h2 class="header">
          Financial Flows
        </h2>
        <b-row>
          <b-col cols="7">
            <h3>Filter:</h3>
            <v-select
              :value="selectedFilter"
              class="filter-select filter-select-org mb-3"
              :options="reportingOrgs"
              :get-option-key="option => option.value"
              :get-option-label="option => option.text"
              :reduce="option => option.value"
              @input="onSelect"
            />

            <div class="quick-filter-list">
              Quick filters:
              <ul class="horizontal-list d-inline">
                <li v-for="filter in quickFilters" :key="filter.name">
                  <a href="#" :title="filter.name" :name="filter.name" @click="onQuickFilter">{{ filter.name }}</a>
                </li>
              </ul>
            </div>
          </b-col>
          <b-col>
            <b-row>
              <b-col>
                Filter for COVID-19 related transactions
                <b-badge
                  v-b-tooltip.hover
                  class="info-icon p-0"
                  variant="dark"
                  pill
                  :title="tooltips['activitiesCOVID']">
                  ?
                </b-badge>:
              </b-col>
              <b-col>
                <b-button-group id="strict">
                  <b-button
                    v-for="(btn, id) in strictToggleOptions"
                    :key="id"
                    :value="btn.value"
                    :class="{ 'active': btn.value===filterParams.strict }"
                    @click="onToggle($event)"
                  >
                    {{ btn.label }}
                  </b-button>
                </b-button-group>
              </b-col>
            </b-row>
            <hr class="my-3">
            <b-row>
              <b-col>
                Only show humanitarian transactions
                <b-badge
                  v-b-tooltip.hover
                  class="info-icon p-0"
                  variant="dark"
                  pill
                  :title="tooltips['activitiesHumanitarian']">
                  ?
                </b-badge>:
              </b-col>
              <b-col>
                <b-button-group id="humanitarian">
                  <b-button
                    v-for="(btn, id) in humanitarianToggleOptions"
                    :key="id"
                    :value="btn.value"
                    :class="{ 'active': btn.value===filterParams.humanitarian }"
                    @click="onToggle($event)"
                  >
                    {{ btn.label }}
                  </b-button>
                </b-button-group>
              </b-col>
            </b-row>
          </b-col>
        </b-row>

        <hr class="my-4">

        <h2 class="my-4">
          <span v-if="activityCount > 10">Top <b>10</b> of </span><b>{{ numberFormatter(activityCount) }}</b> <span v-if="activityCount > 1">activities</span><span v-else>activity</span> by <b>{{ selectedFilterLabel }}</b>
        </h2>

        <b-row>
          <b-col>
            <b-badge variant="dark">
              Funded by
            </b-badge>
          </b-col>
          <b-col class="text-right">
            <b-badge variant="dark">
              Implemented by
            </b-badge>
          </b-col>
        </b-row>
        <SankeyChart :items="filteredData" />
      </b-container>
    </template>
  </div>
</template>
<style>
</style>
<script>
import axios from 'axios'
import csvtojson from 'csvtojson'
import numeral from 'numeral'
import config from '../nuxt.config'
import SankeyChart from '~/components/FinancialSankey.vue'
export default {
  components: {
    SankeyChart
  },
  data () {
    return {
      title: config.head.title,
      selectedFilterDimension: '#org+name+reporting',
      selectedFilterLabel: 'United States Agency for International Development (USAID)',
      selectedFilter: 'United States Agency for International Development (USAID)',
      quickFilters: [
        { name: 'Asian Development Bank' },
        { name: 'Inter-American Development Bank' },
        { name: 'UNOCHA - Central Emergency Response Fund (CERF)' },
        { name: 'United Nations Development Programme' },
        { name: 'United States Agency for International Development (USAID)' },
        { name: 'World Food Programme' }
      ],
      strictToggleOptions: [
        { label: 'Loose', value: 'off' },
        { label: 'Strict', value: 'on' }
      ],
      humanitarianToggleOptions: [
        { label: 'No', value: 'off' },
        { label: 'Yes', value: 'on' }
      ],
      fullData: [],
      filteredData: [],
      filterParams: {},
      lastUpdatedDate: '',
      isProd: true
    }
  },
  computed: {
    isBusy () {
      return this.fullData.length === 0
    },
    tooltips () {
      return this.$store.state.tooltips
    },
    reportingOrgs () {
      const orgList = [...new Set(this.fullData.map(item => item[this.selectedFilterDimension]))]
      return this.populateSelect(orgList, 'All reporting organizations')
    },
    activityCount () {
      return this.filteredData.length
    }
  },
  mounted () {
    this.filterParams = {
      transaction_type: 'spending',
      humanitarian: 'off',
      strict: 'off'
    }

    this.$nextTick(() => {
      if ('org' in this.$route.query) {
        this.filterParams['#org+name+reporting'] = this.$route.query.org
        this.selectedFilter = this.selectedFilterLabel = this.filterParams['#org+name+reporting']
      }
      if ('humanitarian' in this.$route.query) {
        this.filterParams.humanitarian = this.$route.query.humanitarian
      }
      if ('strict' in this.$route.query) {
        this.filterParams.strict = this.$route.query.strict
      }

      this.loadData()
    })
  },
  methods: {
    async loadData () {
      if (process.client) {
        this.isProd = !!(window.location.host.includes('ocha-dap'))
      }
      const dataPath = (this.isProd) ? 'https://ocha-dap.github.io/hdx-scraper-iati-viz/flows.json' : 'https://mcarans.github.io/hdx-scraper-iati-viz/flows.json'
      const filePath = (config.dev) ? '' : '/viz-iati-c19-explorer/'
      await axios.get(filePath + 'tooltips.csv')
        .then((response) => {
          return csvtojson().fromString(response.data).then((jsonData) => {
            this.$store.commit('setTooltips', jsonData)
          })
        })

      await axios.get(dataPath)
        .then((response) => {
          // const metadata = response.data.metadata
          // const dateRun = new Date(metadata['#date+run'])
          // const date = this.months[dateRun.getMonth()] + ' ' + dateRun.getDate() + ', ' + dateRun.getFullYear()
          // this.lastUpdatedDate = date

          this.fullData = response.data.data
          this.updateFilteredData()
        })
    },
    urlQuery () {
      const _query = {}
      if (this.filterParams['#org+name+reporting'] !== '*') {
        _query.org = this.filterParams['#org+name+reporting']
      }
      if (this.filterParams.humanitarian !== 'off') {
        _query.humanitarian = this.filterParams.humanitarian
      }
      if (this.filterParams.strict !== 'off') {
        _query.strict = this.filterParams.strict
      }
      return _query
    },
    updateRouter () {
      this.$router.push({ name: 'financial_flows', query: this.urlQuery() })
    },
    numberFormatter (value) {
      if (value === 0) { return '0' }
      return value
        ? numeral(value).format('0,0')
        : ''
    },
    onSelect (value) {
      this.selectedFilter = value
      this.filterParams[this.selectedFilterDimension] = value
      if (value !== '*') { this.selectedFilterLabel = value } else { this.selectedFilterLabel = 'all reporting organizations' }
      this.updateFilteredData()
    },
    onToggle (event) {
      this.filterParams[event.target.parentElement.id] = event.target.value
      this.updateFilteredData()
    },
    onQuickFilter (event) {
      event.preventDefault()
      this.onSelect(event.target.name)
    },
    updateFilteredData () {
      this.filteredData = this.filterData()
      this.updateRouter()
    },
    filterData () {
      let result = this.fullData
      const params = this.filterParams
      const filterDimension = this.selectedFilterDimension

      if (params[filterDimension] && params[filterDimension] !== '*') {
        result = result.filter(item => item[filterDimension].includes(params[filterDimension]))
      }
      if (params['transaction_type'] === 'spending') {
        result = result.filter(item => item['#x_transaction_type'] === 'spending')
      }
      if (params['humanitarian'] === 'on') {
        result = result.filter(item => item['#indicator+bool+humanitarian'] === 1)
      }
      if (params['strict'] === 'on') {
        result = result.filter(item => item['#indicator+bool+strict'] === 1)
      }
      return result
    },
    populateSelect (data, defaultValue) {
      const selectList = data.reduce((itemList, item) => {
        itemList.push({ value: item, text: item })
        return itemList
      }, []).sort((a, b) =>
        a.text < b.text ? -1 : 1
      )
      selectList.unshift({ value: '*', text: defaultValue })
      return selectList
    },
    getTotal (data) {
      const result = data.map(item => Number(item['#value+total']))
      return (result.length > 0) ? result.reduce((total, value) => total + value) : 0
    }
  }
}
</script>

<style lang='scss'>
  abbr[title], abbr[data-original-title] {
    text-decoration: none;
    cursor: auto;
  }
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
  .quick-filter-list {
    font-size: 14px;
    line-height: 18px;
    li {
      &::after {
        content: " | ";
      }
      &:last-child {
        &::after {
          content: "";
        }
      }
    }
  }
  .filter-select {
    .vs__dropdown-toggle {
      padding: 14px;
    }
    .vs__open-indicator {
      cursor: pointer;
      fill: #000;
    }
    .vs__search,
    .vs__selected {
      font-family: 'Gotham Bold', sans-serif;
    }
  }
</style>
