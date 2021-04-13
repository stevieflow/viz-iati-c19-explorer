import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
  props: ['data', 'options'],
  mounted () {
    this.renderChart(this.data, this.options)
    // this.htmlLegend = this.generateLegend()
  },
  watch: {
    data () {
      this.renderChart(this.data, this.options)
      // this.htmlLegend = this.generateLegend()
    }
  }
}
