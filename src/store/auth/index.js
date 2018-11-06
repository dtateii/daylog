import firebase from 'firebase'

export default {
  namespaced: true,
  state: {
    user: null
  },
  mutations: {
    set: function (state, user) {
      state.user = user
    }
  },
  getters: {
    getUser: (state) => {
      return state.user
    }
  },
  actions: {
    signout: (context) => {
      context.commit('set', null)
      firebase.auth().signOut()
    }
  }
}
