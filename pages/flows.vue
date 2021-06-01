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
          <b-button href="https://ocha-dap.github.io/hdx-scraper-iati-viz/transactions.csv" block class="download-button" variant="outline-dark">
            Download All Data
          </b-button>
        </b-col>
      </b-row>
    </b-container>
    <template v-if="isBusy">
      <div class="text-center text-secondary">
        <b-spinner class="align-middle" />
        <strong>Loading...</strong>
      </div>
    </template>
    <template
      v-if="!isBusy">
      <b-container>
        <h2 class="header">
          Flows
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
            <hr class="my-3">
            <p class="small text-muted">
              Data automatically extracted and updated from the <a href="https://d-portal.org/" target="_blank">d-portal API</a> every 24 hours. During the <a href="https://github.com/OCHA-DAP/covid19-data/actions" target="_blank">latest update</a>, XX,XXX transactions were excluded from consideration. Learn more on the <a href="/about">About this Tool</a> tab.
            </p>
          </b-col>
        </b-row>

        <hr class="my-4">

        <h2 class="my-4">
          <b>{{ activityCount }}</b> activities by <b>{{ selectedFilterLabel }}</b>
        </h2>
      </b-container>

      <!-- <SankeyChart :items="flowsOrganisationsChart" /> -->
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
export default {
  components: {
  },
  filters: {
    truncate (text, length, suffix) {
      if (text.length > length) {
        return text.substring(0, length) + suffix
      } else {
        return text
      }
    }
  },
  data () {
    return {
      title: config.head.title,
      selectedFilterDimension: '#org+name+reporting',
      selectedFilter: '*',
      selectedFilterLabel: 'all publishing organizations',
      quickFilters: [
        { name: 'Asian Development Bank' },
        { name: 'Inter-American Development Bank' },
        { name: 'OCHA Country Based Pooled Funds' },
        { name: 'United Nations Development Programme (UNDP)' },
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
      const orgList = [...new Set(this.fullData.map(item => item['#org+name+reporting']))]
      return this.populateSelect(orgList, 'All publishing organizations')
    },
    activityCount () {
      const activities = [...new Set(this.filteredData.map(item => item['#activity+code']))]
      return numeral(activities.length).format('0,0')
    },
    tagPattern () {
      return (this.selectedFilterDimension === '#org+name+reporting' && this.selectedFilter !== '*') ? '#value+total' : '#value+net'
    }
  },
  mounted () {
    this.filterParams = {
      humanitarian: 'off',
      strict: 'off'
    }
    this.filterParams['#org+name+reporting'] = '*'

    this.loadData()
  },
  methods: {
    async loadData () {
      if (process.client) {
        this.isProd = !!(window.location.host.includes('ocha-dap'))
      }
      const dataPath = (this.isProd) ? 'https://ocha-dap.github.io/hdx-scraper-iati-viz/flows.json' : 'https://ocha-dap.github.io/hdx-scraper-iati-viz/flows.json'
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
          console.log(this.fullData)
          this.filteredData = this.filterData()
        })

      this.$nuxt.$loading.finish()
    },
    setFilterLabel (dimension) {
      this.selectedFilterLabel = 'all publishing organizations'

      // for (let i = 0; i < this.filterOptions.length; i++) {
      //   if (this.filterOptions[i].value === dimension) {
      //     this.selectedFilterLabel = this.filterOptions[i].label.toLowerCase()
      //   }
      // }
    },
    onSelect (value) {
      this.selectedFilter = value
      this.filterParams[this.selectedFilterDimension] = value
      if (value !== '*') { this.selectedFilterLabel = value } else { this.setFilterLabel(this.selectedFilterDimension) }
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
    },
    filterData () {
      let result = this.fullData
      const params = this.filterParams
      const filterDimension = this.selectedFilterDimension

      if (params[filterDimension] && params[filterDimension] !== '*') {
        this.selectedFilterLabel = params[filterDimension]
        result = result.filter(item => item[filterDimension] === params[filterDimension])
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
      const result = data.map(item => Number(item[this.tagPattern]))
      return (result.length > 0) ? result.reduce((total, value) => total + value) : 0
    },
    getFilterID () {
      if (this.selectedFilterDimension === '#sector') { return 2 } else if (this.selectedFilterDimension === '#country') { return 1 } else { return 0 }
    },
    resetParams () {
      this.filterParams['#org+name+reporting'] = '*'
      this.selectedFilter = '*'
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
    text-transform: uppercase;
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
  .col-form-label {
    font-weight: bold;
  }
</style>
