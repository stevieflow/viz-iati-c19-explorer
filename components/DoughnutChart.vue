<template>
  <div>
    <DoughnutChart
      :data="chartData"
      :options="doughnutChartOptions"
      class="doughnut-chart"
    />
  </div>
</template>

<style scoped>
.doughnut-chart {
  height: 180px;
  width: 180px;
}
</style>

<script>
import ChartDataLabels from 'chartjs-plugin-datalabels'
import DoughnutChart from '~/components/Charts/doughnut-chart'
export default {
  name: 'SummaryDoughnutChart',
  components: {
    DoughnutChart
  },
  props: [
    'doughnutChartData',
    'colors'
  ],
  data () {
    return {}
  },
  computed: {
    plugins () {
      return {
        ChartDataLabels
      }
    },
    doughnutChartOptions () {
      return {
        maintainAspectRatio: false,
        legend: false,
        plugins: {
          datalabels: {
            color: '#FFF',
            formatter: (value) => {
              return value + '%'
            }
          }
        },
        tooltips: {
          callbacks: {
            label (tooltipItem, data) {
              return data['labels'][tooltipItem['index']] + ': ' + data['datasets'][0]['data'][tooltipItem['index']] + '%'
            }
          }
        }
      }
    },
    chartData () {
      // const commitmentsColours = ['#007CE1', '#3393E2', '#65ABE3', '#98C3E4', '#CADAE5', '#EEE']
      // const spendingColours = ['#C6382E', '#DC4E44', '#F2645A', '#F0948F', '#EDC4C3', '#EEE']
      return {
        datasets: [{
          borderWidth: 0,
          backgroundColor: this.colors,
          data: this.doughnutChartData
        }],
        labels: ['Developing countries', 'India', 'Afghanistan', 'Pakistan', 'Egypt', 'Other']
      }
    }
  }
}
</script>
