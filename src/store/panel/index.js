export default {
  namespaced: true,
  state: {
    superTitle: 'Agency',
    title: 'Title'
  },
  mutations: {
    setTitle: function (state, title) {
      state.title = title
    },
    setSuperTitle: function (state, superTitle) {
      state.superTitle = superTitle
    }
  },
  getters: {
    getTitle: (state) => {
      return state.title
    },
    getSuperTitle: (state) => {
      return state.superTitle
    }
  }
}
