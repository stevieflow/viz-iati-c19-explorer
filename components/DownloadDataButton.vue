<template>
  <div>
    <b-dropdown id="downloadDropdown" text="Download Data" block class="download-button" variant="outline-dark">
      <b-dropdown-item :href="filePath">
        Download all data
      </b-dropdown-item>
      <b-dropdown-item @click="downloadData()">
        Download the filtered data
      </b-dropdown-item>
    </b-dropdown>

    <div class="text-center pt-2">
      <a href="mailto:hdx@un.org?subject=Feedback on IATI COVID-19 Data Explorer" class="feedback-link">Send us feedback <div class="icon-warning" /></a>
    </div>
  </div>
</template>
<style scoped>

</style>
<script>
export default {
  name: 'DataDownloadButton',
  components: {},
  props: [
    'type',
    'filterParams',
    'selectedFilterDimension'
  ],
  data () {
    return {}
  },
  computed: {
    filePath () {
      return 'https://ocha-dap.github.io/hdx-scraper-iati-viz/' + this.type + '.csv'
    }
  },
  methods: {
    downloadData () {
      const param = (this.filterParams[this.selectedFilterDimension] === '*') ? null : this.filterParams[this.selectedFilterDimension]
      const dimension = this.selectedFilterDimension.split('#')[1]
      const humanitarian = this.filterParams.humanitarian !== 'off'
      const strict = this.filterParams.strict !== 'off'
      const url = this.proxyLink(param, dimension, humanitarian, strict)
      window.open(url)
    },
    checkToken (value, allowed, typeName) {
      if (!allowed.includes(value)) {
        throw new Error('Bad ' + typeName + ': ' + value + '. Expected one of ' + String(allowed))
      }
    },
    proxyLink (selectionValue, selectionType, isHumanitarian, isStrict) {
      // safety check: raise an exception if a token is not in the list of allowed values

      // the GET parameters that we'll pass to the HXL Proxy
      const params = {
        url: this.filePath
      }

      // filter rows by the primary selector (a single org, sector, or country)
      if (selectionValue !== null) {
        this.checkToken(selectionType, ['org+id', 'country', 'sector'], 'selection type')
        params['filter01'] = 'select'
        params['select-query01-01'] = selectionType + '=' + selectionValue
      }

      // optionally filter by humanitarian status
      if (isHumanitarian) {
        params['filter02'] = 'select'
        params['select-query02-01'] = 'indicator+humanitarian=1'
      }

      // optionally filter by strictness
      if (isStrict) {
        params['filter03'] = 'select'
        params['select-query03-01'] = 'indicator+strict=1'
      }

      // aggregate the data
      params['filter04'] = 'count'
      params['count-tags04'] = 'org+id,org+name,org+type,sector,country,activity+code,x_transaction_type'

      params['count-header04-01'] = 'Net money (USD)'
      params['count-type04-01'] = 'sum'
      params['count-pattern04-01'] = params['count-column04-01'] = '#value+net'

      params['count-header04-02'] = 'Total money (USD)'
      params['count-type04-02'] = 'sum'
      params['count-pattern04-02'] = params['count-column04-02'] = '#value+total'

      // remove rows with a value of 0
      params['filter05'] = 'select'
      params['select-query05-01'] = 'value>0'

      // sort the final result by transaction type, then by total value (largest to smallest)
      params['filter06'] = 'sort'
      params['sort-tags06'] = 'x_transaction_type,value+total'
      params['sort-reverse06'] = 'on'

      // return the URL (change "data" to "data.csv" for a direct CSV download, without preview)
      return 'https://proxy.hxlstandard.org/data?' + new URLSearchParams(params).toString()
    }
  }
}
</script>
