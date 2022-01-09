export const state = () => ({
  connection: null,
})

export const mutations = {
  set(state, value) {
    state.connection = value
  },
}
