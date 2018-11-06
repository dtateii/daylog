<template>
  <div class="authScreen">
    <h1>Hello</h1>
    <p>You'll need an account to get started.</p>
    <button @click="signIn">Sign In with Google</button>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  // If just authd, comes back here. Set user in store
  // and automatically proceed.
  created: function () {
    const store = this.$store
    const route = this.$route
    const router = this.$router
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        store.commit('auth/set', user)
        if (route.query.goto) {
          router.push(route.query.goto)
        } else {
          router.push('/')
        }
      } else {
        // todo: Update the page content, button.
        // Make page default to loader until auth completes?
      }
    })
  },
  methods: {
    signIn () {
      const store = this.$store
      const route = this.$route
      const router = this.$router
      firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
          var provider = new firebase.auth.GoogleAuthProvider()
          firebase.auth().signInWithRedirect(provider).then(function (result) {
            // let token = result.credential.accessToken
          }).catch(function (error) {
            console.log(error.message + ' for ' + error.email)
          })
        } else {
          store.commit('auth/set', user)
          if (route.query.goto) {
            router.push(route.query.goto)
          }
        }
      })
    }
  }
}
</script>
