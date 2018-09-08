export default {
  namespaced: true,
  state: {
    user: {}
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
    authenticate: (context) => {
      context.rootState.fb.auth().onAuthStateChanged(function (user) {
        if (user) {
          console.log(user.displayName + ' is logged in.')
          context.commit('set', user)
        } else {
          console.log('not logged in')
          var provider = new context.rootState.fb.auth.GoogleAuthProvider()
          context.rootState.fb.auth().signInWithRedirect(provider).then(function (result) {
            // let token = result.credential.accessToken
          }).catch(function (error) {
            console.log(error.message + ' for ' + error.email)
          })
        }
      })
    },
    signout: (context) => {
      context.rootState.fb.auth().signOut()
    }
  }
}
