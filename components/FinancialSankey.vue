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
  props: ['items', 'params'],
  data () {
    return {
      maximumVisibleItems: 10
    }
  },
  computed: {
    orgNameIndex () {
      return this.$store.state.orgNameIndex
    },
    chartData () {
      const trimName = (value) => {
        if (typeof value === 'undefined') { return value }
        const redactionStrings = ['USAID redacted this field in accordance with the Principled Exceptions outlined in the Office of Management and Budget Bulletin 12-01.',
          'USAID redacted this field in accordance with the exceptions outlined in the Foreign Aid Transparency and Accountability Act of 2016.']
        if (redactionStrings.includes(value)) { return 'Redacted' }
        return value
      }
      const getProvider = (item, transactionType) => {
        if (('outgoing').includes(transactionType)) {
          return `${trimName(item['#org+name+provider']) || trimName(this.getOrgName(item['#org+id+reporting'])) || 'UNKNOWN'} »`
        } else {
          return `${trimName(item['#org+name+provider'])}`
        }
      }
      const getReceiver = (item, transactionType) => {
        if (('outgoing').includes(transactionType)) {
          return `» ${trimName(item['#org+name+receiver'])}`
        } else {
          return `${trimName(this.getOrgName(item['#org+id+reporting']))} »`
        }
      }
      const items = [...this.items].sort((a, b) =>
        a['#value+total'] > b['#value+total'] ? -1 : 1
      ).slice(0, this.maximumVisibleItems)

      const nodes = items.reduce((summary, item) => {
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

      // const test = [...this.items].sort((a, b) =>
      //   a['#value+total'] > b['#value+total'] ? -1 : 1
      // ).reduce((acc, item) => {
      //   const match = acc.find(a => a['#org+name+provider'] === item['#org+name+provider'])
      //   if (!match) {
      //     acc.push(item)
      //   } else {
      //     match['#value+total'] += item['#value+total']
      //   }
      //   return acc
      // }, []).slice(0, this.maximumVisibleItems)

      // console.log(test)

      // const test = (this.params.humanitarian === 'off' || this.params.strict === 'off')
      //   ? links.reduce((acc, link) => {
      //     const match = acc.find(a => a.target === link.target)
      //     if (!match) {
      //       acc.push(link)
      //     } else {
      //       match.value += link.value
      //     }
      //     return acc
      //   }, [])
      //   : links
      const out = {
        nodes,
        links
      }
      console.log(out)
      return out
    }
  },
  methods: {
    getOrgName (id) {
      const org = this.orgNameIndex.filter(org => org['#org+id+reporting'] === id)
      return org[0]['#org+name+reporting']
    }
  }
}
</script>
