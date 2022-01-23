<script>
import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: {
    chartData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      options: {
        showScale: true,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                callback: (value, index, values) => {
                  return `${this.formatNumber(value)} ms`
                },
              },
              gridLines: {
                display: true,
                color: '#EEF0F4',
                borderDash: [5, 15],
              },
            },
          ],
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Time (MM:SS)',
              },
              gridLines: {
                display: true,
                color: '#EEF0F4',
                borderDash: [5, 15],
              },
            },
          ],
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    }
  },
  mounted() {
    this.renderChart(this.chartData, this.options)
  },
  methods: {
    formatNumber(num) {
      let numString = Math.round(num).toString()
      const numberFormatMapping = [
        [6, 'm'],
        [3, 'k'],
      ]
      for (const [numberOfDigits, replacement] of numberFormatMapping) {
        if (numString.length > numberOfDigits) {
          let decimal = ''
          if (numString[numString.length - numberOfDigits] !== '0') {
            decimal = '.' + numString[numString.length - numberOfDigits]
          }
          numString =
            numString.substr(0, numString.length - numberOfDigits) +
            decimal +
            replacement
          break
        }
      }
      return numString
    },
  },
}
</script>
