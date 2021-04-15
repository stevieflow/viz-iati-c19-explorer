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
  data () {
    return {}
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
              gridLines: {
                color: '#000',
                drawOnChartArea: false
              },
              ticks: {
                beginAtZero: true,
                fontColor: '#333',
                fontFamily: 'Source Sans Pro',
                fontSize: 11,
                max: 800000,
                callback (value, index, values) {
                  return numeral(value).format('0a')
                }
              },
              position: 'left'
            },
            {
              id: 'y-axis-right',
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
                  return numeral(value).format('0a')
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
              return data.datasets[item.datasetIndex].label + ': ' + numeral(item.value).format('0,0')
            }
          }
        }
      }
    },
    chartData () {
      return {
        datasets: [
          {
            type: 'line',
            borderColor: '#007CE1',
            borderDash: [4, 2],
            borderWidth: 1,
            data: [4500000, 5000000, 5500000, 6000000, 6000000, 5800000, 5700000, 5900000, 6100000],
            fill: false,
            label: 'Commitment',
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
            data: [4500000, 4900000, 5000000, 5500000, 5500000, 5250000, 4750000, 4950000, 5200000],
            fill: false,
            label: 'Spending',
            pointBackgroundColor: '#FFF',
            pointRadius: 4,
            tension: 0,
            yAxisID: 'y-axis-right'
          },
          {
            label: 'Commitment',
            backgroundColor: '#007CE1',
            data: [450000, 500000, 550000, 600000, 600000, 580000, 570000, 450000, 480000],
            yAxisID: 'y-axis-left'
          },
          {
            label: 'Spending',
            backgroundColor: '#F2645A',
            data: [450000, 490000, 500000, 550000, 550000, 525000, 475000, 450000, 440000],
            yAxisID: 'y-axis-left'
          }
        ],
        labels: ['2/1/20', '3/1/20', '4/1/20', '5/1/20', '6/1/20', '7/1/20', '8/1/20', '9/1/20', '10/1/20']
      }
    },
    customLegend () {
      const htmlLegend = []
      for (let i = 0; i < this.chartData.datasets.length; i++) {
        const item = this.chartData.datasets[i]
        if (i === 0) { htmlLegend.push('<div><h6 class="d-inline">Cumulative: </h6>') }
        if (i === 2) { htmlLegend.push('</div><div class="mr-4"><h6 class="d-inline">Monthly: </h6>') }
        if (item.type === 'line') {
          htmlLegend.push('<div class="key key-circle mr-1 ml-2" style="border-color:' + item.borderColor + '">' + '</div>All ' + item.label)
        } else {
          htmlLegend.push('<div class="key key-square mr-1 ml-2" style="background-color:' + item.backgroundColor + '">' + '</div>All ' + item.label)
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
