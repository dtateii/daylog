import firebase from 'firebase'

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
      return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged(function (user) {
          if (user) {
            context.commit('set', user)
          } else {
            context.commit('set', {})
          }
          resolve()
        })
      })
    },
    signin: (context) => {
      firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
          var provider = new firebase.auth.GoogleAuthProvider()
          firebase.auth().signInWithRedirect(provider).then(function (result) {
            // let token = result.credential.accessToken
          }).catch(function (error) {
            console.log(error.message + ' for ' + error.email)
          })
        } else {
          context.commit('set', user)
        }
      })
    },
    signout: () => {
      firebase.auth().signOut()
    }
  }
}
