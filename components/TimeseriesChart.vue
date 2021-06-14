<template>
  <div>
    <TimeseriesChart
      :data="chartData"
      :options="timeseriesChartOptions"
      class="timeseries-chart"
    />
    <div class="timeseries-legend text-center" v-html="customLegend" />
  </div>
</template>

<script>
import numeral from 'numeral'
import TimeseriesChart from '~/components/Charts/timeseries-chart'
export default {
  name: 'SummaryTimeseriesChart',
  components: {
    TimeseriesChart
  },
  props: [
    'timeseriesChartData'
  ],
  data () {
    return {
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
  },
  computed: {
    timeseriesChartOptions () {
      return {
        maintainAspectRatio: false,
        plugins: {
          datalabels: {
            display: false
          }
        },
        scales: {
          yAxes: [
            {
              id: 'y-axis-left',
              scaleLabel: {
                display: true,
                labelString: 'Monthly Commitments/Spending (USD)'
              },
              gridLines: {
                color: '#000',
                drawOnChartArea: false
              },
              ticks: {
                beginAtZero: true,
                fontColor: '#333',
                fontFamily: 'Source Sans Pro',
                fontSize: 11,
                // max: 100000000000,
                callback (value, index, values) {
                  return numeral(value).format('0a').toUpperCase()
                }
              },
              position: 'left'
            },
            {
              id: 'y-axis-right',
              scaleLabel: {
                display: true,
                labelString: 'Cumulative Commitments/Spending (USD)'
              },
              gridLines: {
                color: '#000',
                drawOnChartArea: false
              },
              ticks: {
                beginAtZero: true,
                fontColor: '#333',
                fontFamily: 'Source Sans Pro',
                fontSize: 11,
                callback (value, index, values) {
                  return numeral(value).format('0a').toUpperCase()
                }
              },
              position: 'right'
            }
          ],
          xAxes: [{
            barPercentage: 0.9,
            categoryPercentage: 0.3,
            gridLines: {
              color: '#000',
              drawOnChartArea: false,
              offsetGridLines: false
            },
            ticks: {
              fontColor: '#333',
              fontFamily: 'Source Sans Pro',
              fontSize: 11
            }
          }]
        },
        legend: {
          display: false
        },
        tooltips: {
          callbacks: {
            label (item, data) {
              const groupLabel = (item.datasetIndex === 0 || item.datasetIndex === 1) ? 'Cumulative' : 'Monthly'
              return groupLabel + ' ' + data.datasets[item.datasetIndex].label + ': $' + numeral(item.value).format('0,0')
            }
          }
        }
      }
    },
    chartData () {
      const dates = this.timeseriesChartData.dates.map((date) => {
        const dateStr = date.split('-')
        const d = new Date(dateStr[0], dateStr[1] - 1)
        return this.months[d.getMonth()] + ' ' + d.getFullYear()
      })
      return {
        datasets: [
          {
            type: 'line',
            borderColor: '#007CE1',
            borderDash: [4, 2],
            borderWidth: 1,
            data: this.timeseriesChartData.cumulative.commitments,
            fill: false,
            label: 'Commitments',
            pointBackgroundColor: '#FFF',
            pointRadius: 4,
            tension: 0,
            yAxisID: 'y-axis-right'
          },
          {
            type: 'line',
            borderColor: '#F2645A',
            borderDash: [4, 2],
            borderWidth: 1,
            data: this.timeseriesChartData.cumulative.spending,
            fill: false,
            label: 'Spending',
            pointBackgroundColor: '#FFF',
            pointRadius: 4,
            tension: 0,
            yAxisID: 'y-axis-right'
          },
          {
            label: 'Commitments',
            backgroundColor: '#007CE1',
            data: this.timeseriesChartData.monthly.commitments,
            yAxisID: 'y-axis-left'
          },
          {
            label: 'Spending',
            backgroundColor: '#F2645A',
            data: this.timeseriesChartData.monthly.spending,
            yAxisID: 'y-axis-left'
          }
        ],
        labels: dates
      }
    },
    customLegend () {
      const htmlLegend = []
      for (let i = 0; i < this.chartData.datasets.length; i++) {
        const item = this.chartData.datasets[i]
        if (i === 0) { htmlLegend.push('<div><h6 class="d-inline">Cumulative: </h6>') }
        if (i === 2) { htmlLegend.push('</div><div class="mr-4"><h6 class="d-inline">Monthly: </h6>') }
        if (item.type === 'line') {
          htmlLegend.push('<div class="key key-circle mr-1 ml-2" style="border-color:' + item.borderColor + '">' + '</div>' + item.label)
        } else {
          htmlLegend.push('<div class="key key-square mr-1 ml-2" style="background-color:' + item.backgroundColor + '">' + '</div>' + item.label)
        }
      }
      htmlLegend.push('</div>')
      return htmlLegend.join('')
    }
  }
}
</script>

<style lang="scss">
.timeseries-legend {
  color: #333;
  display: flex;
  flex-direction: row-reverse;
  font-family: 'Source Sans Pro', 'Helvetica Neue', Arial, sans-serif;
  font-size: 12px;
  justify-content: center;
  margin-top: 5px;
}
.key {
  display: inline-block;
  height: 10px;
  width: 10px;
  &.key-circle {
    border: 1px solid;
    border-radius: 50%;
  }
}
</style>
