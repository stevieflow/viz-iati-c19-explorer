<template>
  <div>
    <template v-if="isBusy">
      <div class="text-center text-secondary">
        <b-spinner class="align-middle" />
        <strong>Loading...</strong>
      </div>
    </template>
    <template v-if="!isBusy">
      <template v-if="isUpdating">
        <div class="text-center text-secondary">
          <b-spinner class="align-middle" />
          <strong>Updating...</strong>
        </div>
      </template>
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
              @input="onSelect"
              class="filter-select filter-select-org mb-3"
              :options="reportingOrgs"
              :get-option-key="option => option.value"
              :get-option-label="option => option.text"
              :reduce="option => option.value"
            />

            <v-select
              v-if="selectedFilterDimension==='country'"
              :value="this.selectedFilter"
              @input="onSelect"
              class="filter-select filter-select-country mb-3"
              :options="countries"
              :get-option-key="option => option.value"
              :get-option-label="option => option.text"
              :reduce="option => option.value"
              placeholder="All recipient regions/countries"
            />

            <v-select
              v-if="selectedFilterDimension==='sector'"
              :value="this.selectedFilter"
              @input="onSelect"
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
                  <a href="#" @click="onQuickFilterClick" :name="filter.name">{{ filter.name }}</a> |
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
                    @click="onToggleClick($event)"
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
                    @click="onToggleClick($event)"
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

                <b-table borderless small class="summary-table mr-5 mb-0" :fields="tableFields" :items="commitmentsTable">
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

                <b-table borderless small class="summary-table mr-5 mb-0" :fields="tableFields" :items="spendingTable">
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
        { name: 'Asian Development Bank'},
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
      isUpdating: false,
      allData: [],
      filteredData: {},
      filterParams: {
        humanitarian: 'off',
        strict: 'off',
        org: '*',
        country: '*',
        sector: '*',
        //month: '*'
      }
    }
  },
  computed: {
    isBusy () {
      return this.allData.length === 0
    },
    tooltips () {
      return this.$store.state.tooltips
    },
    reportingOrgs () {
      return this.populateSelect(this.allData.getValues('#org'), 'All publishing organizations')
    },
    countries () {
      return this.populateSelect(this.allData.getValues('#country'), 'All recipient regions/countries')
    },
    sectors () {
      return this.populateSelect(this.allData.getValues('#sector'), 'All sectors')
    },
    commitments () {
      return this.filteredData.withRows('x_transaction_type=commitments')
    },
    spending () {
      return this.filteredData.withRows('x_transaction_type=spending')
    },
    commitmentsCountryRanked () {
      return this.commitments.count('#country', '#value+net').sort('#value+sum', true).preview(5).rows
    },
    spendingCountryRanked () {
      return this.spending.count('#country', '#value+net').sort('#value+sum', true).preview(5).rows
    },
    activityCount () {
      return numeral(this.filteredData.getValues('#activity+code').length).format('0,0')
    },
    totalCommitments () {
      return numeral(this.commitments.getSum('#value+total')).format('0.0a')
    },
    totalSpending () {
      return numeral(this.spending.getSum('#value+total')).format('0.0a')
    },
    commitmentsTable () {
      return this.populateList(this.commitments, this.selectedCommitmentFilter, '#value+net')
    },
    spendingTable () {
      return this.populateList(this.spending, this.selectedSpendingFilter, "#value+net")
    },
    commitmentsDonut () {
      return this.populateDonut('commitments', this.selectedCommitmentFilter, '#value+net')
    },
    spendingDonut () {
      return this.populateDonut('spending', this.selectedSpendingFilter, '#value+net')
    },
    timeseriesData () {
      const monthlyCommitments = this.commitments.count('#date+month', '#value+net')
      const monthlySpending = this.spending.count('#date+month', '#value+net')
      const cumulativeCommitments = this.commitments.count('#date+month', '#value+total')
      const cumulativeSpending = this.spending.count('#date+month', '#value+total')
      return { 
        dates: monthlyCommitments.getRawValues("#date+month"), 
        monthly: { 
          commitments: monthlyCommitments.getRawValues("#value+sum"), 
          spending: monthlySpending.getRawValues("#value+sum") 
        },
        cumulative: {
          commitments: cumulativeCommitments.getRawValues("#value+sum"), 
          spending: cumulativeSpending.getRawValues("#value+sum") 
        } 
      }
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    async loadData () {
      const filePath = (config.dev) ? '' : '/viz-covid19-visualisation/'
      await axios.get(filePath + 'tooltips.csv')
        .then((response) => {
          return csvtojson().fromString(response.data).then((jsonData) => {
            this.$store.commit('setTooltips', jsonData)
          })
        })

      await axios.get('https://davidmegginson.github.io/c19-iati-data/data/transactions.json')
        .then((response) => {
          this.allData = hxl.wrap(response.data)
          this.filteredData = this.filterData()
        })

      this.$nuxt.$loading.finish()
    },
    updateRouter () {
      // this.$router.push({ name: 'overview', query: this.urlQuery })
    },
    setFilterLabel (dimension) {
      this.selectedFilterLabel = '*'
      for (let i = 0; i < this.filterOptions.length; i++) {
        if (this.filterOptions[i].value === dimension) {
          this.selectedFilterLabel = this.filterOptions[i].label.toLowerCase()
        }
      }
    },
    onFilterOptionSelect (selected) {
      this.selectedFilterDimension = selected
      this.setFilterLabel(selected)
      this.updateFilteredData()
    },
    onSelect(value) {
      this.selectedFilter = value
      this.filterParams[this.selectedFilterDimension] = value
      if (value!=='*') this.selectedFilterLabel = value
      else this.setFilterLabel(this.selectedFilterDimension)
      this.updateFilteredData()
    },
    onToggleClick (event) {
      this.filterParams[event.target.parentElement.id] = event.target.value
      this.updateFilteredData()
    },
    onQuickFilterClick (event) {
      this.selectedFilterDimension = 'org'
      this.onSelect(event.target.name)
    },
    updateFilteredData () {
      this.filteredData = this.filterData()
    },
    filterData () {
      console.log('isUpdating')
      this.isUpdating = true
      let result = this.allData;
      const params = this.filterParams
      const filterDimension = this.selectedFilterDimension
      if (params['org'] && params['org'] !== '*') {
        this.selectedFilterLabel = params['org']
        result = result.withRows({
          pattern: '#' + 'org',
          test: params['org']
        })
      }
      if (params[filterDimension] && params[filterDimension] !== '*') {
        this.selectedFilterLabel = params[filterDimension]
        result = result.withRows({
          pattern: '#' + filterDimension,
          test: params[filterDimension]
        })
      }
      if (params[filterDimension] && params[filterDimension] !== '*') {
        this.selectedFilterLabel = params[filterDimension]
        result = result.withRows({
          pattern: '#' + filterDimension,
          test: params[filterDimension]
        })
      }
      if (params['humanitarian'] === 'on') {
        result = result.withRows({
          pattern: '#indicator+bool+humanitarian',
          test: '1'
        })
      }
      if (params['strict'] === 'on') {
        result = result.withRows({
          pattern: '#indicator+bool+strict',
          test: '1'
        })
      }

      console.log('is not Updating')
      this.isUpdating = false
      return result
    },
    populateSelect (data, defaultValue) {
      data = data.sort()
      const select = [{ value: '*', text: defaultValue }]
      data.forEach((item) => {
        select.push({ value: item, text: item })
      })
      return select
    },
    populateList (data, entityPattern, valuePattern) {
      //const rows = data.count(entityPattern, valuePattern).sort('#value+sum', true).preview(5).rows
      const rows = this.commitmentsCountryRanked
      const list = []
      rows.forEach((row) => {
        list.push({ item: row.get(entityPattern), value: numeral(row.get("#value+sum")).format('0,0')})
      })
      return list
    },
    populateDonut (dimension, entityPattern, valuePattern) {
      const data = this[dimension]
      //const rows = data.count(entityPattern, valuePattern).sort('#value+sum', true).preview(5).rows
      const rows = this.commitmentsCountryRanked
      const ratios = []
      const labels = []
      const total = data.getSum('#value+total')
      let sum = Number(0)
      rows.forEach((row) => {
        const value = row.get("#value+sum")
        const ratio = numeral((value / total) * 100).format('0.0')
        sum += Number(ratio)
        ratios.push( Number(ratio) )
        labels.push( row.get(entityPattern) )
      })
      if (sum!==100) { //calculate Other value if sum < 100
        ratios[ratios.length] = Number(numeral(100 - sum).format('0.0'))
        labels.push('Other')
      }
      return { values: ratios, labels: labels }
    },
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
