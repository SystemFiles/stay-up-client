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
      <p>a list of services being tracked</p>

      <div class="container mt-5 mx-auto">
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
export default {
  name: 'StayupHome',
  components: { ServiceListItem },
  data() {
    return {
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
  beforeMount() {
    if (this.connection) {
      console.log('Closing any left-over connections ... ')
      this.connection.close(1000)
    }
  },
  mounted() {
    console.log('Creating connection to stay-up websocket server...')
    const conn = new WebSocket(this.$config.API_WEBSOCK_URL)
    const vm = this
    conn.onmessage = function (event) {
      const data = event.data ? JSON.parse(event.data) : []
      vm.$data.services = data
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
  methods: {
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
      // console.log("NOT IMPLEMENTED");
      // console.log(`Will update: ${svc.Name} (${svc.ID})`);
      // this.$data.error = true;
      // this.$data.errorMessage = "Feature not implemented yet...";
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
  },
}
</script>
