<template>
  <div>
    <TimeseriesChart
      :data="chartData"
      :options="timeseriesChartOptions"
      class="timeseries-chart"
    />
    <div class="timeseries-legend text-center">
      <ul class="horizontal-list" v-html="customLegend" />
    </div>
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
        }
      }
    },
    chartData () {
      return {
        datasets: [
          {
            label: 'Commitment',
            backgroundColor: '#007CE1',
            data: [450000, 500000, 550000, 650000, 650000, 500000, 550000, 650000, 650000],
            yAxisID: 'y-axis-left'
          },
          {
            label: 'Spending',
            backgroundColor: '#F2645A',
            data: [450000, 525000, 500000, 560000, 560000, 525000, 500000, 560000, 560000],
            yAxisID: 'y-axis-left'
          },
          {
            type: 'line',
            borderColor: '#007CE1',
            borderDash: [4, 2],
            borderWidth: 1,
            data: [5000000, 5500000, 6000000, 5600000, 7500000, 5500000, 6000000, 5600000, 7500000],
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
            data: [4900000, 5250000, 5500000, 6750000, 7100000, 5250000, 5500000, 6750000, 7100000],
            fill: false,
            label: 'Spending',
            pointBackgroundColor: '#FFF',
            pointRadius: 4,
            tension: 0,
            yAxisID: 'y-axis-right'
          }
        ],
        labels: ['2/1/20', '3/1/20', '4/1/20', '5/1/20', '6/1/20', '7/1/20', '8/1/20', '9/1/20', '10/1/20']
      }
    },
    customLegend () {
      const htmlLegend = []
      for (let i = 0; i < this.chartData.datasets.length; i++) {
        const item = this.chartData.datasets[i]
        htmlLegend.push('<li class="mr-2">')
        if (i === 0) { htmlLegend.push('<h6 class="d-inline pr-2">Monthly: </h6>') }
        if (i === 2) { htmlLegend.push('<h6 class="d-inline pl-4 pr-2">Cumulative: </h6>') }
        if (item.type === 'line') {
          htmlLegend.push('<div class="key key-circle mr-1" style="border-color:' + item.borderColor + '">' + '</div>All ' + item.label)
        } else {
          htmlLegend.push('<div class="key key-square mr-1" style="background-color:' + item.backgroundColor + '">' + '</div>All ' + item.label)
        }
        htmlLegend.push('</li>')
      }
      return htmlLegend.join('')
    }
  }
}
</script>

<style lang="scss">
.timeseries-legend {
  color: #333;
  font-family: 'Source Sans Pro', 'Helvetica Neue', Arial, sans-serif;
  font-size: 12px;
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
