<template>
  <div class="auth">
    <h1>Authenticate</h1>
    <div id="firebaseui-auth-container"></div>
    <span>{{user.displayName}}</span>
    <button
      @click='signout'>Sign Out</button>
  </div>
</template>

<script>
export default {
  name: 'auth',
  computed: {
    user: function () {
      return this.$store.getters['user/getUser']
    }
  },
  created () {
    this.$store.dispatch('user/authenticate')
  },
  methods: {
    signout () {
      this.$store.dispatch('user/signout')
    }
  }
}
</script>

<style lang="scss" scoped>
button {
  margin: 2em auto;
  display: block;
}
</style>
