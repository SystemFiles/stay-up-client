<template>
  <div class="add-page">
    <div class="banner">
      <div class="container" style="margin-top: 2.4rem">
        <h1 class="d-flex justify-content-center logo-font">StayUp</h1>
        <p class="d-flex justify-content-center">
          Ultra-Lightweight Service / Host Monitoring Solution
        </p>
      </div>
    </div>
    <div class="container page">
      <BarLoader
        class="w-100 position-fixed fixed-bottom"
        :loading="isLoading"
        :size="150"
      ></BarLoader>
      <div class="row mt-5">
        <form data-bitwarden-watching="1" @submit.prevent="onPublish">
          <fieldset>
            <legend>Add a Service</legend>
            <div class="form-group">
              <label for="serviceName" class="form-label mt-4"
                >Service Name</label
              >
              <input
                id="serviceNameInput"
                v-model="serviceName"
                type="name"
                class="form-control"
                aria-describedby="nameHelp"
                placeholder="enter a name for the service"
              />
              <label for="serviceDesc" class="form-label mt-4"
                >Short Description</label
              >
              <input
                id="serviceDescInput"
                v-model="serviceDesc"
                type="text"
                class="form-control"
                placeholder="enter a short description of the service"
              />
            </div>
            <div class="form-group">
              <label for="serviceHost" class="form-label mt-4"
                >Host and Port</label
              >
              <div class="row">
                <div class="col-sm-8 col-8">
                  <input
                    id="serviceHostInput"
                    v-model="serviceHost"
                    type="text"
                    class="form-control"
                    placeholder="IPv4 or Hostname"
                  />
                </div>
                <div class="col-sm-4 col-4">
                  <input
                    id="servicePortInput"
                    v-model="servicePort"
                    type="number"
                    class="form-control"
                    placeholder=": port"
                  />
                </div>
              </div>

              <small id="nameHelp" class="form-text text-muted">
                Do
                <u>not</u> include protocol headers (http://, https://, etc)
              </small>
            </div>
            <div class="form-group">
              <label for="serviceProtocol" class="form-label mt-4"
                >Communication Protocol</label
              >
              <select
                id="serviceProtocol"
                v-model="serviceProtocol"
                class="form-select"
              >
                <option value="TCP">Transmission Control Protocol (TCP)</option>
                <option value="UDP">User Datagram Protocol (UDP)</option>
              </select>
            </div>
            <div class="form-group mt-4">
              <fieldset class="form-group">
                <label for="serviceTimeout" class="form-label"
                  >Timeout (ms)</label
                >
                <input
                  id="serviceTimeout"
                  v-model="serviceTimeout"
                  type="range"
                  class="form-range"
                  min="0"
                  max="1000"
                  step="50"
                />
                <p class="d-flex justify-content-end">
                  {{ serviceTimeout }} ms
                </p>
              </fieldset>
            </div>
            <br />
            <button type="submit" class="btn btn-primary mb-2">Submit</button>
            <nuxt-link to="/" replace>
              <button type="button" class="btn btn-secondary mb-2">
                Cancel
              </button>
            </nuxt-link>
          </fieldset>
        </form>
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
  </div>
</template>

<script>
import { BarLoader } from '@saeris/vue-spinners'
export default {
  name: 'StayupAdd',
  components: {
    BarLoader,
  },
  data() {
    return {
      isLoading: false,
      error: false,
      errorMessage: '',
      serviceName: '',
      serviceHost: '',
      servicePort: '',
      serviceDesc: '',
      serviceProtocol: 'TCP',
      serviceTimeout: 250,
    }
  },
  methods: {
    toggleError() {
      this.$data.error = false
    },
    onPublish() {
      if (process.client) {
        const reqData = {
          name: this.$data.serviceName.trim().substring(0, 17),
          description:
            this.$data.serviceDesc.length > 0
              ? this.$data.serviceDesc.trim().substring(0, 28)
              : 'No description was provided',
          host: this.$data.serviceHost.trim(),
          port: parseInt(this.$data.servicePort),
          protocol: this.$data.serviceProtocol.trim(),
          timeout: parseInt(this.$data.serviceTimeout),
        }

        // start loading
        this.$data.isLoading = true

        this.$axios
          .$post(`${this.$config.API_BASE_URL}/service`, reqData)
          .then(() => {
            this.$data.isLoading = false
            this.$router.replace({ name: 'index' })
          })
          .catch((err) => {
            console.log(err.response ? err.response.data.message : err.message)
            this.$data.isLoading = false
            this.$data.error = true
            this.$data.errorMessage = `Could not create new service. See log for details.`
          })
      }
    },
  },
}
</script>
