<template>
  <div class="auth">
    <h1>Authenticate</h1>
    <p>You have to log in.</p>
  </div>
</template>

<script>
export default {
  name: 'auth',
  created () {
    this.$store.dispatch('auth/signin')
  }
}
</script>
