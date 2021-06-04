<template>
  <div>
    <template v-if="chartData.links.length>0">
      <div class="chart">
        <client-only>
          <sankey-chart :chart-data="chartData" />
        </client-only>
      </div>
    </template>
    <template v-else>
      <b-alert show class="text-muted text-center" variant="warning">
        No activities published so far for this organisation.
      </b-alert>
    </template>
  </div>
</template>

<style scoped>
  .chart{
    width: 100%;
    height: 500px;
  }
</style>

<script>
import SankeyChart from '~/components/Charts/sankey-chart.vue'

export default {
  components: {
    SankeyChart
  },
  props: ['items'],
  data () {
    return {
      maximumVisibleItems: 10
    }
  },
  computed: {
    chartData () {
      const trimName = (value) => {
        if (typeof value === 'undefined') { return value }
        const redactionStrings = ['USAID redacted this field in accordance with the Principled Exceptions outlined in the Office of Management and Budget Bulletin 12-01.',
          'USAID redacted this field in accordance with the exceptions outlined in the Foreign Aid Transparency and Accountability Act of 2016.']
        if (redactionStrings.includes(value)) { return 'Redacted' }
        if (value.length > 50) {
          return value.substr(0, 50) + '...'
        }
        return value
      }
      const getProvider = (item, transactionType) => {
        if (('outgoing').includes(transactionType)) {
          return `${trimName(item['#org+name+provider']) || trimName(item['#org+name+reporting']) || 'UNKNOWN'} »`
        } else {
          return `${trimName(item['#org+name+provider'])}`
        }
      }
      const getReceiver = (item, transactionType) => {
        if (('outgoing').includes(transactionType)) {
          return `» ${trimName(item['#org+name+receiver'])}`
        } else {
          return `${trimName(item['#org+name+reporting'])} »`
        }
      }
      const items = [...this.items].sort((a, b) =>
        a['#value+total'] > b['#value+total'] ? -1 : 1
      ).slice(0, this.maximumVisibleItems)
      const nodes = items.reduce((summary, item) => {
        console.log(item)
        const provider = getProvider(item, item['#x_transaction_direction'])
        const receiver = getReceiver(item, item['#x_transaction_direction'])
        if (!summary.includes(provider)) {
          summary.push(provider)
        }
        if (!summary.includes(receiver)) {
          summary.push(receiver)
        }
        return summary
      }, []).map((item) => {
        return { name: item }
      })
      const links = items.map((item) => {
        const provider = getProvider(item, item['#x_transaction_direction'])
        const receiver = getReceiver(item, item['#x_transaction_direction'])
        return {
          source: provider,
          target: receiver,
          value: Math.round(item['#value+total'])
        }
      })
      const out = {
        nodes,
        links
      }
      return out
    }
  }
}
</script>
