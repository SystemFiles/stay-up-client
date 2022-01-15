<script>
import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: {
    chartData: {
      type: Object,
      default: null
    }
  },
  // updated() {
  //   this.$nextTick(function () {
  //     this.renderChart(this.chartData,
  //       {
  //         responsive: true,
  //         maintainAspectRatio: false,
  //         title: {
  //           display: true,
  //           text: "Realtime Latency of Services"
  //         }
  //       }
  //     )
  //   })
  // },
  mounted() {
    this.renderChart(this.chartData,
      {
        responsive: true,
        maintainAspectRatio: true,
        title: {
          display: true,
          text: "Realtime Latency of Services"
        },
        scales: {
            yAxes: [{
                ticks: {
                    min: 0,
                    max: 60
                }
            }],
            xAxes: [
              {
                ticks: {
                  display: false
                }
              }
            ]
        }
      }
    )
  }
}

/*
{
        labels: [new Date().toLocaleDateString()],
        datasets: [
          {
            label: "Jellyfin",
            data: [2],
            backgroundColor: "rgba(119,255,221,0.4)",
            borderColor: "rgba(1, 116, 188, 0.50)",
            pointBackgroundColor: "#f8f7f5"
          },
          {
            label: "Bitwarden",
            data: [],
            backgroundColor: "rgba(102,255,34,0.4)",
            borderColor: "rgba(1, 116, 188, 0.50)",
            pointBackgroundColor: "#ab47bcff"
          }
        ]
      },
*/
</script>