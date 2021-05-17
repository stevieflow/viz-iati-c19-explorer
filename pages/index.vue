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
                v-model="selectedFilterDimension"
                :options="filterOptions"
                name="filterOptionGroup"
                stacked
                @change="onFilterOptionSelect"
              />
            </b-form-group>

            <v-select
              v-if="selectedFilterDimension==='org'"
              :value="this.selectedFilter"
              class="filter-select filter-select-org mb-3"
              :options="reportingOrgs"
              :get-option-key="option => option.value"
              :get-option-label="option => option.text"
              :reduce="option => option.value"
              @input="onSelect"
            />

            <v-select
              v-if="selectedFilterDimension==='country'"
              :value="this.selectedFilter"
              class="filter-select filter-select-country mb-3"
              :options="countries"
              :get-option-key="option => option.value"
              :get-option-label="option => option.text"
              :reduce="option => option.value"
              @input="onSelect"
            />

            <v-select
              v-if="selectedFilterDimension==='sector'"
              :value="this.selectedFilter"
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
                <li v-for="filter in quickFilters" :key="filter.name">
                  <a href="#" :name="filter.name" @click="onQuickFilter">{{ filter.name }}</a> |
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
                  :title="tooltips['placeholder']">
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
                  :title="tooltips['placeholder']">
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
              xx,xxx transactions excluded. Explanation/definition about the Icon here lorem ipsum dolor sit amet, consectetur adipiscing elit,  lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <p class="small text-muted">
              All reported transactions are as of X date
            </p>
          </b-col>
        </b-row>

        <hr class="my-4">

        <h2 class="my-4">
          <b>{{ activityCount }}</b> activities by <b>{{ selectedFilterLabel }}</b>
        </h2>
        <h2 class="header">
          Key Figures
        </h2>

        <b-row>
          <b-col>
            <div class="key-figure-container">
              <!-- <DoughnutChart
                :doughnut-chart-data="commitmentsDonut"
                :colors="commitmentColors"
              /> -->
              <div class="key-figure-breakdown w-100 ml-4 mr-5">
                <h3>
                  Total Commitments (USD)
                  <b-badge
                    v-b-tooltip.hover
                    class="info-icon p-0"
                    variant="dark"
                    pill
                    :title="tooltips['placeholder']">
                    ?
                  </b-badge>
                </h3>
                <div class="key-figure-num">
                  {{ totalCommitments }}
                </div>
                <b-form-select
                  v-model="selectedCommitmentFilter"
                  class="form-select pl-0 my-3"
                  size="sm"
                  :options="keyFigureFilter"
                />

                <!-- <b-table borderless small class="summary-table mr-5 mb-0" :fields="tableFields" :items="commitmentsTable">
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
                </b-table> -->
              </div>
            </div>
          </b-col>
          <b-col>
            <div class="key-figure-container">
              <!-- <DoughnutChart
                :doughnut-chart-data="spendingDonut"
                :colors="spendingColors"
              /> -->
              <div class="key-figure-breakdown w-100 ml-4 mr-5">
                <h3>
                  Total Spending (USD)
                  <b-badge
                    v-b-tooltip.hover
                    class="info-icon p-0"
                    variant="dark"
                    pill
                    :title="tooltips['placeholder']">
                    ?
                  </b-badge>
                </h3>
                <div class="key-figure-num">
                  {{ totalSpending }}
                </div>
                <b-form-select
                  id="spendingSelect"
                  v-model="selectedSpendingFilter"
                  class="form-select pl-0 my-3"
                  size="sm"
                  :options="keyFigureFilter"
                />

                <!-- <b-table borderless small class="summary-table mr-5 mb-0" :fields="tableFields" :items="spendingTable">
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
                </b-table> -->
              </div>
            </div>
          </b-col>
        </b-row>

        <h2 class="header">
          Cumulative Total Commitments and Spending Over Time
        </h2>

        <TimeseriesChart
          :timeseries-chart-data="timeseriesData"
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
export default {
  components: {
    DoughnutChart,
    TimeseriesChart
  },
  data () {
    return {
      title: config.head.title,
      selectedFilterDimension: 'org',
      selectedFilter: '*',
      selectedFilterLabel: 'all publishing organizations',
      filterOptions: [
        { text: 'By Publishing Organization', value: 'org', label: 'all publishing organizations' },
        { text: 'By Recipient Region / Country', value: 'country', label: 'all recipient regions / countries' },
        { text: 'By Sector', value: 'sector', label: 'all sectors' }
      ],
      selectedCommitmentFilter: '#country',
      selectedSpendingFilter: '#country',
      keyFigureFilter: [
        { text: 'By Recipient Countries', value: '#country' },
        { text: 'By Publishing Orgs', value: '#org' }
      ],
      quickFilters: [
        { name: 'Asian Development Bank' },
        { name: 'Inter-American Development Bank' },
        { name: 'United Nations Office for the Coordination of Humanitarian Affairs' },
        { name: 'United Nations Development Programme' },
        { name: 'U.S. Agency for International Development' },
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
      tableFields: [
        { key: 'color', label: 'Color' },
        'item',
        'value'
      ],
      commitmentColors: ['#007CE1', '#3393E2', '#65ABE3', '#98C3E4', '#CADAE5', '#EEE'],
      spendingColors: ['#C6382E', '#DC4E44', '#F2645A', '#F0948F', '#EDC4C3', '#EEE'],
      allData: [],
      fullData: [],
      filteredData: {},
      testOrgs: [],
      filterParams: {
        humanitarian: 'off',
        strict: 'off',
        org: '*',
        country: '*',
        sector: '*'
        // month: '*'
      }
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
      console.log('reportingOrgs')
      const orgList = [...new Set(this.fullData.map(item => item['#org+name'] ))]
      return this.populateSelect(orgList, 'All publishing organizations')
    },
    countries () {
      console.log('countries')
      const countryList = [...new Set(this.fullData.map(item => item['#country'] ))]
      return this.populateSelect(countryList, 'All recipient regions/countries')
    },
    sectors () {
      console.log('sectors')
      const sectorList = [...new Set(this.fullData.map(item => item['#sector'] ))]
      return this.populateSelect(sectorList, 'All sectors')
    },
    commitments () {
      console.log('commitments')
      return this.filteredData.filter(item => item['#x_transaction_type'] === 'commitments')
    },
    spending () {
      console.log('spending')
      return this.filteredData.filter(item => item['#x_transaction_type'] === 'spending')
    },
    commitmentsRanked () {
      console.log('commitmentsRanked')

      const items = [...new Set(this.commitments.map(item => item[this.selectedCommitmentFilter] ))]
      let temp = []
      const ref = this
      items.forEach(function(item) {
        const arr = ref.commitments.filter(it => it[ref.selectedCommitmentFilter] === item)
        let total = 0
        arr.forEach(function(a) {
          total += Number(a[ref.tagPattern])
        })
        temp.push({item: item, value: total})
      })

      let ranked = temp.sort((a, b) => parseFloat(b.value) - parseFloat(a.value))
      return ranked.slice(0,5)
      //return this.commitments.count(this.selectedCommitmentFilter, this.tagPattern).sort('#value+sum', true).preview(5).rows
    },
    spendingRanked () {
      console.log('spendingRanked')

      const items = [...new Set(this.spending.map(item => item[this.selectedSpendingFilter] ))]
      let temp = []
      const ref = this
      items.forEach(function(item) {
        const arr = ref.spending.filter(it => it[ref.selectedSpendingFilter] === item)
        let total = 0
        arr.forEach(function(a) {
          total += Number(a[ref.tagPattern])
        })
        temp.push({item: item, value: total})
      })

      let ranked = temp.sort((a, b) => parseFloat(b.value) - parseFloat(a.value))
      return ranked.slice(0,5)
      //return this.spending.count(this.selectedSpendingFilter, this.tagPattern).sort('#value+sum', true).preview(5).rows
    },
    activityCount () {
      console.log('activityCount')
      const activities = [...new Set(this.filteredData.map(item => item['#activity+code'] ))]
      return numeral(activities.length).format('0,0')
    },
    totalCommitments () {
      console.log('totalCommitments')
      const result = this.commitments.map( item => Number(item[this.tagPattern]) )
      const sum = (result.length>0) ? result.reduce((total, amount) => total + amount) : 0
      return numeral(sum).format('0.0a')
    },
    tagPattern() {
      console.log('tagPattern')
      return (this.selectedFilterDimension === 'org' && this.selectedFilter !== '*') ? '#value+total' : '#value+net'
    },
    totalSpending () {
      console.log('totalSpending')
      const result = this.spending.map( item => Number(item[this.tagPattern]) )
      const sum = (result.length>0) ? result.reduce((total, amount) => total + amount) : 0
      return numeral(sum).format('0.0a')
    },
    commitmentsTable () {
      console.log('commitmentsTable')
      return this.populateList(this.commitmentsRanked, this.selectedCommitmentFilter)
    },
    spendingTable () {
      console.log('spendingTable')
      return this.populateList(this.spendingRanked, this.selectedSpendingFilter)
    },
    commitmentsDonut () {
      console.log('commitmentsDonut')
      return this.populateDonut('commitments', this.selectedCommitmentFilter)
    },
    spendingDonut () {
      console.log('spendingDonut')
      return this.populateDonut('spending', this.selectedSpendingFilter)
    },
    timeseriesData () {
      console.log('timeseriesData')
      const dates = [...new Set(this.filteredData.map(item => item['#date+month'] ))]

      let monthlyCommitments = []
      let monthlySpending = []
      const ref = this
      dates.forEach(function(date) {
        const currentCommitment = ref.commitments.filter(item => item['#date+month'] === date)
        let totalCommitments = 0
        currentCommitment.forEach(function(month) {
          totalCommitments += Number(month[ref.tagPattern])
        })
        monthlyCommitments.push(totalCommitments)

        const currentSpending = ref.spending.filter(item => item['#date+month'] === date)
        let totalSpending = 0
        currentSpending.forEach(function(month) {
          totalSpending += Number(month[ref.tagPattern])
        })
        monthlySpending.push(totalSpending)
      })

      return {
        dates: dates,
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
    this.loadData()
  },
  methods: {
    async loadData () {
      console.log('loadData')
      const filePath = (config.dev) ? '' : '/viz-covid19-visualisation/'
      await axios.get(filePath + 'tooltips.csv')
        .then((response) => {
          return csvtojson().fromString(response.data).then((jsonData) => {
            this.$store.commit('setTooltips', jsonData)
          })
        })

      await axios.get('https://proxy.hxlstandard.org/data.objects.json?dest=data_edit&strip-headers=on&url=https%3A%2F%2Focha-dap.github.io%2Fhdx-scraper-iati-viz%2Ftransactions.csv')
        .then((response) => {
          console.log('proxy',response)
          this.fullData = response.data
          this.filteredData = this.filterData()
        })

      this.$nuxt.$loading.finish()
    },
    updateRouter () {
      // this.$router.push({ name: 'overview', query: this.urlQuery })
    },
    setFilterLabel (dimension) {
      console.log('setFilterLabel')
      this.selectedFilterLabel = '*'
      for (let i = 0; i < this.filterOptions.length; i++) {
        if (this.filterOptions[i].value === dimension) {
          this.selectedFilterLabel = this.filterOptions[i].label.toLowerCase()
        }
      }
    },
    onFilterOptionSelect (selected) {
      console.log('onFilterOptionSelect')
      this.resetParams()
      this.selectedFilterDimension = selected
      this.setFilterLabel(selected)
      this.updateFilteredData()
    },
    onSelect (value) {
      console.log('onSelect')
      this.selectedFilter = value
      this.filterParams[this.selectedFilterDimension] = value
      if (value !== '*') { this.selectedFilterLabel = value } else { this.setFilterLabel(this.selectedFilterDimension) }
      this.updateFilteredData()
    },
    onToggle (event) {
      console.log('onToggle')
      this.filterParams[event.target.parentElement.id] = event.target.value
      this.updateFilteredData()
    },
    onQuickFilter (event) {
      console.log('onQuickFilter')
      this.selectedFilterDimension = 'org'
      this.onSelect(event.target.name)
    },
    updateFilteredData () {
      console.log('updateFilteredData')
      this.filteredData = this.filterData()
    },
    filterData () {
      console.log('filterData')
      let result = this.fullData
      const params = this.filterParams
      const filterDimension = this.selectedFilterDimension

      // this.filterOptions.forEach(function(option) {
      //   if (params[option.value] && params[option.value] !== '*') {
      //     this.selectedFilterLabel = params[option.value]
      //     result = result.withRows({
      //       pattern: '#' + option.value,
      //       test: params[option.value]
      //     })
      //   }
      // })
      if (params[filterDimension] && params[filterDimension] !== '*') {
        this.selectedFilterLabel = params[filterDimension]
        const tag = (filterDimension === 'org') ? '#org+name' : '#'+filterDimension
        result = result.filter(item => item[tag] === params[filterDimension])
      }

      if (params['humanitarian'] === 'on') {
        result = result.filter(item => item['#indicator+bool+humanitarian'] === '1')
      }
      if (params['strict'] === 'on') {
        result = result.filter(item => item['#indicator+bool+strict'] === '1')
      }

      return result
    },
    populateSelect (data, defaultValue) {
      console.log('populateSelect')
      data = data.sort()
      const select = [{ value: '*', text: defaultValue }]
      data.forEach((item) => {
        select.push({ value: item, text: item })
      })
      return select
      // const selectList = data.reduce((itemList, item) => {
      //   itemList.push({ value: item, text: item })
      //   return itemList
      // }, []).sort((a, b) =>
      //   a.text < b.text ? -1 : 1
      // )
      // selectList.unshift({ value: '*', text: defaultValue })
      // return selectList
    },
    populateList (data, entityPattern) {
      console.log('populateList')
      const rows = data
      const list = []
      rows.forEach((row) => {
        list.push({ item: row.item, value: numeral(row.value).format('0,0') })
        //list.push({ item: row.get(entityPattern), value: numeral(row.get('#value+sum')).format('0,0') })
      })
      return list
    },
    populateDonut (category, entityPattern) {
      console.log('populateDonut')
      const rows = this[category + 'Ranked']
      const total = this[category].map( item => Number(item[this.tagPattern]) ).reduce((total, amount) => total + amount)
      //const total = this[category].getSum(this.tagPattern)
      const ratios = []
      const labels = []
      let sum = Number(0)
      rows.forEach((row) => {
        const value = row.value
        const ratio = numeral((value / total) * 100).format('0.0')
        sum += Number(ratio)
        ratios.push(Number(ratio))
        labels.push(row.item)
      })
      if (sum < 100) { // calculate Other value if sum < 100
        ratios[ratios.length] = Number(numeral(100 - sum).format('0.0'))
        labels.push('Other')
      }
      return { values: ratios, labels: labels }
    },
    getCumulativeSeries (data) {
      console.log('getCumulativeSeries')
      const cumulativeArray = []
      let total = 0
      data.forEach((value) => {
        total += value
        cumulativeArray.push(total)
      })
      return cumulativeArray
    },
    resetParams () {
      this.filterParams.org = '*'
      this.filterParams.country = '*'
      this.filterParams.sector = '*'
      this.selectedFilter = '*'
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
