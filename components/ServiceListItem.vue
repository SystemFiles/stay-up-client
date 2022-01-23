<template>
  <div class="card my-2">
    <div class="card-body">
      <h4 class="card-title">{{ name.trim().substring(0, 17) }}</h4>
      <h6 style="font-size: 0.6rem" class="card-subtitle mb-2 text-muted">
        {{ host }}:{{ port }}
      </h6>
      <p style="font-size: small" class="card-text">
        {{
          description.trim().substring(0, 38) +
          (description.length >= 38 ? ' ...' : '')
        }}
      </p>
      <div class="row mx-0">
        <div
          :class="{
            'bg-success': currentStatus === 'UP',
            'bg-warning': currentStatus === 'SLOW',
            'bg-danger': currentStatus === 'DOWN',
          }"
          class="badge px-5 py-3 mx-auto"
        >
          {{ currentStatus }}
        </div>
      </div>
      <div class="row mt-2">
        <div class="col-md-6" style="padding-right: 5px">
          <button type="button" class="w-100 btn btn-danger" @click="deleteSvc">
            DELETE
          </button>
        </div>
        <div class="col-md-6" style="padding-left: 5px">
          <button
            type="button"
            class="w-100 btn btn-primary"
            @click="updateSvc"
          >
            EDIT
          </button>
        </div>
      </div>
      <div class="row mt-3">
        <p
          style="font-size: small"
          class="card-text text-muted d-flex justify-content-center"
        >
          Up-time: {{ truncateUptime(uptimeSeconds) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ServiceListItem',
  props: {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    host: {
      type: String,
      required: true,
    },
    port: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: false,
      default: 'No description was provided',
    },
    currentStatus: {
      type: String,
      required: true,
    },
    uptimeSeconds: {
      type: Number,
      required: true,
    },
  },
  methods: {
    truncateUptime(uptimeSeconds) {
      return new Date(uptimeSeconds * 1000).toISOString().substring(14, 19)
    },
    deleteSvc() {
      this.$emit('deleteSvc')
    },
    updateSvc() {
      this.$emit('updateSvc')
    },
  },
}
</script>
