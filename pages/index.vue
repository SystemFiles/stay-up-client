<template>
  <div :key="componentKey" class="home-page">
    <div class="banner">
      <div class="container" style="margin-top: 2.4rem">
        <h1 class="d-flex justify-content-center logo-font">StayUp</h1>
        <p class="d-flex justify-content-center">
          Ultra-Lightweight Service / Host Monitoring Solution
        </p>
      </div>
    </div>
    <div class="container page">
      <h2 class="mt-5">Services</h2>
      <p class="mb-5">service monitoring with realtime latency reports</p>
      
      <div class="chart-container my-0">
        <LatencyLineChart :chart-data="chartData" />
      </div>

      <div class="container mt-5 mx-auto service-box">
        <div class="row">
          <div v-if="!services.length">
            <p class="d-flex justify-content-center mt-5">
              No services to display ... try adding one!
            </p>
          </div>
          <div v-for="svc in services" :key="svc.ID" class="col-md-3">
            <ServiceListItem
              :id="svc.ID"
              :name="svc.Name"
              :description="svc.Description"
              :host="svc.Host"
              :port="svc.Port"
              :current-status="svc.CurrentStatus"
              :uptime-seconds="svc.UptimeSeconds"
              @deleteSvc="deleteSvc(svc)"
              @updateSvc="updateSvc(svc)"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="container operations fixed-bottom">
      <div class="row bg-body pb-1 justify-content-end">
        <div class="col-md-2 col-sm-12">
          <nuxt-link to="/add" replace>
            <button type="button" class="w-100 my-1 btn btn-success">
              ADD
            </button>
          </nuxt-link>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="fixed-bottom mb-5 ml-5 d-flex justify-content-end">
        <div
          v-if="error"
          class="toast show"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div class="toast-header">
            <strong class="me-auto">Error</strong>
            <button
              type="button"
              class="btn-close ms-2 mb-1"
              data-bs-dismiss="toast"
              aria-label="Close"
              @click="toggleError"
            >
              <span aria-hidden="true"></span>
            </button>
          </div>
          <div class="toast-body">{{ errorMessage }}</div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="fixed-bottom mb-5 ml-5 d-flex justify-content-end">
        <div
          v-if="success"
          class="toast show"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div class="toast-header">
            <strong class="me-auto">StayUp</strong>
            <button
              type="button"
              class="btn-close ms-2 mb-1"
              data-bs-dismiss="toast"
              aria-label="Close"
              @click="toggleSuccess"
            >
              <span aria-hidden="true"></span>
            </button>
          </div>
          <div class="toast-body">{{ successMessage }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ServiceListItem from '../components/ServiceListItem.vue'
import LatencyLineChart from '../components/LatencyLineChart.vue'
export default {
  name: 'StayupHome',
  components: { ServiceListItem, LatencyLineChart,  },
  data() {
    return {
      firstLoad: false,
      chartData: {},
      services: [],
      error: false,
      errorMessage: '',
      success: false,
      successMessage: '',
      componentKey: 0,
    }
  },
  computed: {
    connection() {
      return this.$store.state.connection
    },
  },
  created() {
    this.$data.firstLoad = true
  },
  beforeMount() {
    if (this.connection) {
      console.log('Closing any left-over connections ... ')
      this.connection.close(1000) // normal closure
    }
  },
  mounted() {
    // open websocker for service data
    this.openWebsocketConn()
  },
  methods: {
    openWebsocketConn() {
      console.log('Creating connection to stay-up websocket server...')
      const conn = new WebSocket(this.$config.API_WEBSOCK_URL)
      const vm = this
      conn.onmessage = function (event) {
        const data = event.data ? JSON.parse(event.data) : []

        // init chart data (if first time with data)
        if (vm.$data.firstLoad && data.length > 0) {
          // init chart data
          vm.initChartData(data)
          vm.$data.firstLoad = false
        } else {
          // update chart data on each message
          vm.$data.services = data
          vm.updateChartData()
        }
      }
      conn.onopen = function (event) {
        console.log('Successfully opened connection to stay-up websocket server!')
        console.log(event)
      }
      conn.onerror = function (err) {
        console.log(`Error occurred in websocket connection: ${err}`)
        vm.$data.error = true
        vm.$data.errorMessage =
          'Failed to load data from websocket. Websocket connection closed. Refresh the page to try again'
      }
      conn.onclose = function (event) {
        console.log('Closed connection to stay-up websocket server')
        console.log(event)
        vm.$data.services = []
      }

      // set connection in global state
      this.setConnection(conn)
    },
    toggleError() {
      this.$data.error = false
    },
    toggleSuccess() {
      this.$data.success = false
    },
    refresh() {
      this.componentKey += 1 // will force re-render
    },
    updateSvc(svc) {
      this.$router.push(`edit/${svc.ID}`)
    },
    deleteSvc(svc) {
      this.$axios
        .$delete(`${this.$config.API_BASE_URL}/service/${svc.ID}`)
        .then(() => {
          this.$data.success = true
          this.$data.successMessage = `Successfully deleted service, ${svc.Name} (${svc.ID})!`
        })
        .catch((err) => {
          this.$data.error = true
          this.$data.errorMessage = `Failed to delete service, ${svc.Name} (${svc.ID}). See log for details.`
          console.log(err.response ? err.response.data.message : err.message)
        })
    },
    setConnection(conn) {
      this.$store.commit('set', conn)
    },
    initChartData(serviceList) {
      const timestamp = this.formatTime(new Date())
      const initData = {
        labels: [timestamp],
        datasets: serviceList.map((svc) => {
          return {
            label: svc.Name,
            backgroundColor: `${this.generateRandomRGBAColor()}`,
            pointHitRadius: 5,
            pointHoverRadius: 5,
            data: [svc.LatencyMs]
          }
        })
      }

      // Initialize chartData
      this.$data.chartData = initData
    },
    updateChartData() {
      const historyDistance = 12 // how many previous updates to keep on the chart
      const timestamp = this.formatTime(new Date())

      // current service + chart data
      const serviceData = this.$data.services
      const existingChartData = this.$data.chartData

      const updatedDatasets = []
      for (const ds of existingChartData.datasets) {
        updatedDatasets.push({
          label: ds.label,
          backgroundColor: ds.backgroundColor,
          pointHitRadius: ds.pointHitRadius,
          pointHoverRadius: ds.pointHoverRadius,
          data: [...existingChartData.datasets.filter((o) => (o.label === ds.label))[0].data.slice(-historyDistance), serviceData.filter((svc) => (svc.Name === ds.label))[0].LatencyMs]
        })
      }

      // append the changes (timestamp and current latency)
      const updateChartData = {
        labels: [...existingChartData.labels.slice(-historyDistance), timestamp],
        datasets: updatedDatasets
      }

      // return updated chartData object containing the new changes
      this.$data.chartData = updateChartData
    },
    generateRandomRGBAColor() {
      const o = Math.round
      const r = Math.random
      const s = 255
      return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',0.7)'
    },
    formatTime(date) {
      return `${date.getMinutes()}:${String(date.getSeconds()).padStart(2, '0')}`
    }
  },
}
</script>

<style>
.service-box {
  margin-bottom: 10rem;
}
.chart-container {
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 15px 30px 0 rgba(0,0,0,.11), 0 5px 15px 0 rgba(0,0,0,.08);
  padding: 2rem 4rem;
  margin: 1rem 0;
}
</style>