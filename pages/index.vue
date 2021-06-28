<template>
  <div>
    <b-container>
      <b-row>
        <b-col cols="9">
          <p class="overview-description">
            The <a href="https://iatistandard.org/" target="_blank">International Aid Transparency Initiative</a> (IATI) is a global effort to improve the transparency of development and humanitarian resources and their results to address poverty and crises. This page allows you to explore all of the published IATI data that is related to the coronavirus pandemic by examining the commitments and spending made by or to a specific organization, recipient country, or sector.
          </p>
        </b-col>
        <b-col>
          <DownloadDataButton
            type="transactions"
            :filter-params="filterParams"
            :selected-filter-dimension="selectedFilterDimension"
          />
        </b-col>
      </b-row>
    </b-container>
    <template v-if="isBusy">
      <div class="custom-loader text-center text-secondary my-5">
        <b-spinner class="align-middle" />
        <strong>Loading...</strong>
      </div>
    </template>
    <template v-if="!isBusy">
      <b-container>
        <hr class="my-4">

        <b-row ref="filters">
          <b-col cols="7">
            <b-form-group label="Filter:">
              <b-form-radio-group
                id="filterGroup"
                v-model="selectedFilterDimension"
                :options="filterOptions"
                name="filterOptionGroup"
                stacked
                @change="onFilterOptionSelect"
              />
            </b-form-group>

            <v-select
              v-if="selectedFilterDimension==='#org+id'"
              :value="selectedFilter"
              class="filter-select filter-select-org mb-3"
              :options="reportingOrgs"
              :get-option-key="option => option.value"
              :get-option-label="option => option.text"
              :reduce="option => option.value"
              @input="onSelect"
            />

            <v-select
              v-if="selectedFilterDimension==='#country'"
              :value="selectedFilter"
              class="filter-select filter-select-country mb-3"
              :options="countries"
              :get-option-key="option => option.value"
              :get-option-label="option => option.text"
              :reduce="option => option.value"
              @input="onSelect"
            />

            <v-select
              v-if="selectedFilterDimension==='#sector'"
              :value="selectedFilter"
              class="filter-select filter-select-sector mb-3"
              :options="sectors"
              :get-option-key="option => option.value"
              :get-option-label="option => option.text"
              :reduce="option => option.value"
              @input="onSelect"
            />

            <div class="quick-filter-list">
              Quick filters:
              <ul class="horizontal-list d-inline">
                <li v-for="filter in quickFilters[getFilterID(selectedFilterDimension)]" :key="filter.id">
                  <a :id="filter.id" href="#" :title="filter.name" @click="onQuickFilter">{{ filter.name }}</a>
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
              Data automatically extracted and updated from the <a href="https://d-portal.org/" target="_blank">d-portal API</a> every 24 hours. During the <a href="https://github.com/OCHA-DAP/covid19-data/actions" target="_blank">latest update</a>, {{ skippedTransactions }} transactions were excluded from consideration. Learn more on the <NuxtLink to="/about">
                About this Tool
              </NuxtLink> tab.
            </p>
          </b-col>
        </b-row>

        <hr class="mt-4 mb-0">

        <h2 class="header-sticky">
          <div><b>{{ numberFormatter(activityCount) }}</b> <span v-if="activityCount > 1 || activityCount===0">activities</span><span v-else>activity</span> by <b>{{ selectedFilterLabel }}</b></div>
          <a class="anchor" @click="scrollTo('filters')">Customize filters</a>
        </h2>
        <h2 class="header">
          Commitments and Spending Ranking
        </h2>

        <b-row>
          <b-col>
            <b-form-select
              v-model="selectedRankingFilter"
              class="form-select px-2 ml-3 mb-3"
              :options="rankingFilter[getFilterID(selectedFilterDimension)]"
            />
          </b-col>
          <b-col />
        </b-row>

        <b-row>
          <b-col>
            <div class="key-figure-container">
              <DoughnutChart
                :doughnut-chart-data="commitmentsDonut"
                :colors="commitmentColors"
              />
              <div class="key-figure-breakdown w-100 ml-4 mr-5">
                <h3>
                  Total Commitments (USD)
                  <b-badge
                    v-b-tooltip.hover
                    class="info-icon p-0"
                    variant="dark"
                    pill
                    :title="tooltips['totalCommitments']">
                    ?
                  </b-badge>
                </h3>
                <div class="key-figure-num">
                  {{ totalCommitments }}
                </div>

                <div class="scroll-list-container">
                  <div class="scroll-list mt-3">
                    <b-table borderless small class="summary-table mr-5 mb-0" :fields="tableFields" :items="commitmentsTable">
                      <template #cell(color)="data">
                        <div class="color-key" :style="'background-color: ' + commitmentColors[data.index]" />
                      </template>
                      <template #cell(item)="data">
                        <abbr :title="data.item.item" :class="data.index>5 ? 'list-breakdown' : ''">{{ data.item.item | truncate(18, '...') }}</abbr>
                      </template>
                      <template #cell(value)="data">
                        <span :class="data.index>5 ? 'text-muted' : ''">{{ data.item.value }}</span>
                      </template>
                    </b-table>
                  </div>
                  <div class="scroll-list-overlay" />
                </div>
                <div class="scroll-list-footer mt-2">
                  <span class="small text-muted">{{ lastUpdatedDate }} | IATI</span>
                  <span>(USD)</span>
                </div>
              </div>
            </div>
          </b-col>
          <b-col>
            <div class="key-figure-container">
              <DoughnutChart
                :doughnut-chart-data="spendingDonut"
                :colors="spendingColors"
              />
              <div class="key-figure-breakdown w-100 ml-4 mr-5">
                <h3>
                  Total Spending (USD)
                  <b-badge
                    v-b-tooltip.hover
                    class="info-icon p-0"
                    variant="dark"
                    pill
                    :title="tooltips['totalSpending']">
                    ?
                  </b-badge>
                </h3>
                <div class="key-figure-num">
                  {{ totalSpending }}
                </div>

                <div class="scroll-list-container">
                  <div class="scroll-list mt-3">
                    <b-table borderless small class="summary-table mr-5 mb-0" :fields="tableFields" :items="spendingTable">
                      <template #cell(color)="data">
                        <div class="color-key" :style="'background-color: ' + spendingColors[data.index]" />
                      </template>
                      <template #cell(item)="data">
                        <abbr :title="data.item.item" :class="data.index>5 ? 'list-breakdown text-muted' : ''">{{ data.item.item | truncate(18, '...') }}</abbr>
                      </template>
                      <template #cell(value)="data">
                        <span :class="data.index>5 ? 'text-muted' : ''">{{ data.item.value }}</span>
                      </template>
                    </b-table>
                  </div>
                  <div class="scroll-list-overlay" />
                </div>
                <div class="scroll-list-footer mt-2">
                  <span class="small text-muted">{{ lastUpdatedDate }} | IATI</span>
                  <span>(USD)</span>
                </div>
              </div>
            </div>
          </b-col>
        </b-row>

        <h2 class="header">
          Commitments and Spending Over Time
        </h2>

        <b-row>
          <b-col>
            <b-form-select
              v-model="timeseriesSelect"
              class="form-select pl-2 pr-4 ml-3 mt-0 mb-4"
              :options="timeseriesSelectOptions"
            />
          </b-col>
          <b-col />
        </b-row>

        <TimeseriesChart
          :timeseries-chart-data="timeseriesData"
          :chart-type="timeseriesSelect"
        />
      </b-container>
    </template>
  </div>
</template>

<script>
import axios from 'axios'
import csvtojson from 'csvtojson'
import numeral from 'numeral'
import config from '../nuxt.config'
import DoughnutChart from '~/components/DoughnutChart'
import TimeseriesChart from '~/components/TimeseriesChart'
import DownloadDataButton from '~/components/DownloadDataButton'
export default {
  components: {
    DoughnutChart,
    TimeseriesChart,
    DownloadDataButton
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
      selectedFilterDimension: '#org+id',
      selectedFilter: '*',
      selectedFilterLabel: 'all publishing organizations',
      filterOptions: [
        { text: 'By Publishing Organization', value: '#org+id', label: 'all publishing organizations' },
        { text: 'By Recipient Country', value: '#country', label: 'all recipient countries' },
        { text: 'By Sector', value: '#sector', label: 'all sectors' }
      ],
      selectedRankingFilter: '#country',
      rankingFilter: [
        [
          { text: 'By Recipient Country', value: '#country' },
          { text: 'By Sector', value: '#sector' }
        ],
        [
          { text: 'By Publishing Org', value: '#org+id' },
          { text: 'By Sector', value: '#sector' }
        ],
        [
          { text: 'By Recipient Country', value: '#country' },
          { text: 'By Publishing Org', value: '#org+id' }
        ]
      ],
      timeseriesSelect: 'Cumulative and Monthly Commitments/Spending',
      timeseriesSelectOptions: [
        'Cumulative and Monthly Commitments/Spending',
        'Cumulative Commitments/Spending',
        'Monthly Commitments/Spending'
      ],
      quickFilters: [
        [
          { name: 'Asian Development Bank', id: 'xm-dac-46004' },
          { name: 'Inter-American Development Bank', id: 'xi-iati-iadb' },
          { name: 'UNOCHA - Central Emergency Response Fund (CERF)', id: 'xm-ocha-cerf' },
          { name: 'United Nations Development Programme', id: 'xm-dac-41114' },
          { name: 'United States Agency for International Development (USAID)', id: 'us-gov-1' },
          { name: 'World Food Programme', id: 'xm-dac-41140' }
        ],
        [
          { name: 'India', id: 'India' },
          { name: 'Brazil', id: 'Brazil' },
          { name: 'Afghanistan', id: 'Afghanistan' },
          { name: 'Bangladesh', id: 'Bangladesh' },
          { name: 'South Sudan', id: 'South Sudan' }
        ],
        [
          { name: 'Emergency Response', id: 'Emergency Response' },
          { name: 'Health', id: 'Health' },
          { name: 'Education', id: 'Education' },
          { name: 'Reconstruction Relief & Rehabilitation', id: 'Reconstruction Relief & Rehabilitation' },
          { name: 'Transport & Storage', id: 'Transport & Storage' }
        ]
      ],
      strictToggleOptions: [
        { label: 'Loose', value: 'off' },
        { label: 'Strict', value: 'on' }
      ],
      humanitarianToggleOptions: [
        { label: 'No', value: 'off' },
        { label: 'Yes', value: 'on' }
      ],
      tableFields: [
        { key: 'color', label: 'Color' },
        'item',
        'value'
      ],
      commitmentColors: ['#007CE1', '#3393E2', '#65ABE3', '#98C3E4', '#CADAE5', '#EEE'],
      spendingColors: ['#C6382E', '#DC4E44', '#F2645A', '#F0948F', '#EDC4C3', '#EEE'],
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      fullData: [],
      filteredData: [],
      filterParams: {},
      orgNameIndex: [],
      lastUpdatedDate: '',
      skippedTransactions: 0,
      loaded: false
    }
  },
  head () {
    return {
      title: config.head.title + ': Commitments and Spending'
    }
  },
  computed: {
    isBusy () {
      return this.fullData.length === 0
    },
    tooltips () {
      return this.$store.state.tooltips
    },
    isProd () {
      return this.$store.state.isProd
    },
    reportingOrgs () {
      let orgList = [...new Set(this.fullData.map(item => item['#org+id']))]
      orgList = orgList.map((item) => {
        const org = {}
        org.value = item
        org.text = this.getOrgName(item)
        return org
      })
      return this.populateSelect(orgList, 'All publishing organizations')
    },
    countries () {
      let countryList = [...new Set(this.fullData.map(item => item['#country']))]
      countryList = countryList.map((item) => {
        const country = {}
        country.value = item
        country.text = item
        return country
      })
      return this.populateSelect(countryList, 'All recipient countries')
    },
    sectors () {
      let sectorList = [...new Set(this.fullData.map(item => item['#sector']))]
      sectorList = sectorList.map((item) => {
        const sector = {}
        sector.value = item
        sector.text = item
        return sector
      })
      return this.populateSelect(sectorList, 'All sectors')
    },
    commitments () {
      return this.filteredData.filter(item => item['#x_transaction_type'] === 'commitments')
    },
    spending () {
      return this.filteredData.filter(item => item['#x_transaction_type'] === 'spending')
    },
    commitmentsRanked () {
      return this.getRankedList(this.commitments)
    },
    spendingRanked () {
      return this.getRankedList(this.spending)
    },
    activityCount () {
      const activities = [...new Set(this.filteredData.map(item => item['#activity+code']))]
      return activities.length
    },
    totalCommitments () {
      const sum = this.getTotal(this.commitments)
      return numeral(sum).format('$0.0a')
    },
    totalSpending () {
      const sum = this.getTotal(this.spending)
      return numeral(sum).format('$0.0a')
    },
    tagPattern () {
      return (this.selectedFilterDimension === '#org+id' && this.selectedFilter !== '*') ? '#value+total' : '#value+net'
    },
    commitmentsTable () {
      return this.populateList(this.commitmentsRanked)
    },
    spendingTable () {
      return this.populateList(this.spendingRanked)
    },
    commitmentsDonut () {
      return this.populateDonut(this.commitments, this.commitmentsRanked)
    },
    spendingDonut () {
      return this.populateDonut(this.spending, this.spendingRanked)
    },
    timeseriesData () {
      const ref = this
      const dates = [...new Set(this.filteredData.map(item => item['#date+month']))]

      const monthlyCommitments = Object.values(this.commitments.reduce((acc, item) => {
        let val = Number(item[ref.tagPattern])
        val = (val < 0) ? 0 : val
        acc[item['#date+month']] = acc[item['#date+month']] + val || 0
        return acc
      }, []))

      const monthlySpending = Object.values(this.spending.reduce((acc, item) => {
        let val = Number(item[ref.tagPattern])
        val = (val < 0) ? 0 : val
        acc[item['#date+month']] = acc[item['#date+month']] + val || 0
        return acc
      }, []))

      return {
        dates,
        monthly: {
          commitments: monthlyCommitments,
          spending: monthlySpending
        },
        cumulative: {
          commitments: this.getCumulativeSeries(monthlyCommitments),
          spending: this.getCumulativeSeries(monthlySpending)
        }
      }
    }
  },
  mounted () {
    this.toggleBodyClass('addClass', 'index')

    this.filterParams = {
      humanitarian: 'off',
      strict: 'off'
    }
    this.filterParams['#org+id'] = '*'
    this.filterParams['#country'] = '*'
    this.filterParams['#sector'] = '*'

    const dataPath = (this.isProd) ? 'https://ocha-dap.github.io/hdx-scraper-iati-viz/reporting_orgs.json' : 'https://mcarans.github.io/hdx-scraper-iati-viz/reporting_orgs.json'
    axios.get(dataPath)
      .then((response) => {
        this.orgNameIndex = response.data.data
        this.$store.commit('setorgNameIndex', response.data.data)

        this.$nextTick(() => {
          if ('org' in this.$route.query) {
            this.filterParams['#org+id'] = this.$route.query.org
            this.querySetup('#org+id')
          }
          if ('country' in this.$route.query) {
            this.filterParams['#country'] = this.$route.query.country
            this.querySetup('#country')
          }
          if ('sector' in this.$route.query) {
            this.filterParams['#sector'] = this.$route.query.sector
            this.querySetup('#sector')
          }
          if ('humanitarian' in this.$route.query) {
            this.filterParams.humanitarian = this.$route.query.humanitarian
          }
          if ('strict' in this.$route.query) {
            this.filterParams.strict = this.$route.query.strict
          }

          this.loadData()
        })
      })
  },
  updated () {
    this.createStickyHeader()
  },
  destroyed () {
    this.toggleBodyClass('removeClass', 'index')
  },
  methods: {
    async loadData () {
      const dataPath = (this.isProd) ? 'https://ocha-dap.github.io/hdx-scraper-iati-viz/transactions.json' : 'https://mcarans.github.io/hdx-scraper-iati-viz/transactions.json'
      const filePath = (config.dev) ? '' : '/viz-iati-c19-explorer/'
      await axios.get(filePath + 'tooltips.csv')
        .then((response) => {
          return csvtojson().fromString(response.data).then((jsonData) => {
            this.$store.commit('setTooltips', jsonData)
          })
        })

      await axios.get(dataPath)
        .then((response) => {
          // process the metadata
          const metadata = response.data.metadata
          const dateRun = new Date(metadata['#date+run'])
          const date = this.months[dateRun.getMonth()] + ' ' + dateRun.getDate() + ', ' + dateRun.getFullYear()
          this.lastUpdatedDate = date
          this.skippedTransactions = this.numberFormatter(metadata['#meta+transactions+skipped+num'])

          // process the transaction data
          this.fullData = response.data.data

          this.filteredData = this.filterData()
        })
    },
    urlQuery () {
      const _query = {}
      if (this.filterParams['#org+id'] !== '*') {
        _query.org = this.filterParams['#org+id']
      }
      if (this.filterParams['#country'] !== '*') {
        _query.country = this.filterParams['#country']
      }
      if (this.filterParams['#sector'] !== '*') {
        _query.sector = this.filterParams['#sector']
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
      this.$router.push({ name: 'index', query: this.urlQuery() })
    },
    querySetup (dimension) {
      this.selectedFilterDimension = dimension
      this.selectedFilter = this.filterParams[dimension]
      this.selectedFilterLabel = this.getOrgName(this.selectedFilter)
      const filterArray = this.rankingFilter[this.getFilterID(dimension)]
      this.selectedRankingFilter = filterArray[0].value
    },
    numberFormatter (value) {
      if (value === 0) { return '0' }
      return value
        ? numeral(value).format('0,0')
        : ''
    },
    onFilterOptionSelect (selected) {
      const filterArray = this.rankingFilter[this.getFilterID(selected)]
      this.selectedRankingFilter = filterArray[0].value

      this.resetParams()
      this.setDefaultFilterLabel(selected)
      this.updateFilteredData()
    },
    onSelect (value) {
      this.selectedFilter = value
      this.filterParams[this.selectedFilterDimension] = value
      if (value !== '*') {
        this.selectedFilterLabel = (this.selectedFilterDimension === '#org+id') ? this.getOrgName(value) : value
      } else {
        this.setDefaultFilterLabel(this.selectedFilterDimension)
      }
      this.updateFilteredData()
    },
    onToggle (event) {
      this.filterParams[event.target.parentElement.id] = event.target.value
      this.updateFilteredData()
    },
    onQuickFilter (event) {
      event.preventDefault()
      this.onSelect(event.target.id)
    },
    setDefaultFilterLabel (dimension) {
      const filterOption = this.filterOptions.filter(option => option.value === dimension)
      this.selectedFilterLabel = filterOption[0].label.toLowerCase()
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
        itemList.push({ value: item.value, text: item.text })
        return itemList
      }, []).sort((a, b) =>
        a.text < b.text ? -1 : 1
      )
      selectList.unshift({ value: '*', text: defaultValue })
      return selectList
    },
    populateList (data) {
      return data.reduce((list, item) => {
        list.push({ item: item[0], value: '$' + this.numberFormatter(item[1]) })
        return list
      }, []).sort((a, b) =>
        b.value - a.value
      )
    },
    populateDonut (data, rankedData) {
      const ranked = (rankedData.length > 6) ? rankedData.slice(0, 6) : rankedData
      const total = this.getTotal(data)
      const ratios = ranked.reduce((list, item) => {
        const ratio = Number(((item[1] / total) * 100).toFixed(1))
        list.push(ratio)
        return list
      }, [])
      const labels = ranked.map(row => row[0])
      return { values: ratios, labels }
    },
    getOrgName (id) {
      const org = this.orgNameIndex.filter(org => org['#org+id+reporting'] === id)
      return org[0]['#org+name+reporting']
    },
    getOrgID (name) {
      const org = this.orgNameIndex.filter(org => org['#org+name+reporting'] === name)
      return org[0]['#org+id+reporting']
    },
    getCumulativeSeries (data) {
      let total = 0
      return data.reduce((cumulativeValues, value) => {
        total += value
        cumulativeValues.push(total)
        return cumulativeValues
      }, [])
    },
    getTotal (data) {
      const result = data.map(item => Number(item[this.tagPattern]))
      return (result.length > 0) ? result.reduce((total, value) => total + value) : 0
    },
    getRankedList (data) {
      const dimension = this.selectedRankingFilter
      const total = this.getTotal(data)
      const ranked = Object.entries(data.reduce((list, item, index) => {
        if (!item[dimension].includes('Unspecified')) {
          const value = Number(item[this.tagPattern])
          const key = (dimension === '#org+id') ? this.getOrgName(item[dimension]) : item[dimension]
          list[key] = list[key] + value || value
        }
        return list
      }, {})).sort((a, b) =>
        b[1] - a[1]
      )
      // calculate sum of top 5 and append 'Other' value if sum < 100
      const sum = ranked.slice(0, 5).reduce((total, amount) => {
        return total + amount[1]
      }, 0)
      if (sum < total) { ranked.splice(5, 0, ['Other or unspecified', total - sum]) }
      return ranked
    },
    getFilterID () {
      if (this.selectedFilterDimension === '#sector') { return 2 } else if (this.selectedFilterDimension === '#country') { return 1 } else { return 0 }
    },
    resetParams () {
      this.filterParams['#org+id'] = '*'
      this.filterParams['#country'] = '*'
      this.filterParams['#sector'] = '*'
      this.selectedFilter = '*'
    },
    toggleBodyClass (addRemoveClass, className) {
      const el = document.body

      if (addRemoveClass === 'addClass') {
        el.classList.add(className)
      } else {
        el.classList.remove(className)
      }
    },
    createStickyHeader () {
      const el = document.getElementsByClassName('header-sticky')[0]
      if (!this.loaded && el !== undefined) {
        this.loaded = true
        const observer = new IntersectionObserver(
          ([e]) => e.target.classList.toggle('is-stuck', e.intersectionRatio < 1),
          { threshold: [1] }
        )
        observer.observe(el)
      }
    },
    scrollTo (refName) {
      const element = this.$refs[refName]
      const top = element.offsetTop
      window.scrollTo(0, top)
    }
  }
}
</script>

<style lang='scss'>
  abbr[title], abbr[data-original-title] {
    text-decoration: none;
    cursor: auto;
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
        padding-right: 0;
        text-align: right;
      }
    }
  }
  .color-key {
    height: 12px;
    width: 12px;
  }
  .scroll-list-container {
    position: relative;
  }
  .scroll-list {
    height: 168px;
    max-width: 273px;
    overflow-y: scroll;
    .list-breakdown {
      color: #888;
      padding-left: 10px;
    }
  }
  .scroll-list-overlay {
    background: rgb(255,255,255);
    background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 100%);
    bottom: 0;
    height: 30px;
    pointer-events: none;
    position: absolute;
    width: 100%;
  }
  .scroll-list-footer {
    display: flex;
    font-size: 14px;
    justify-content: space-between;
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
