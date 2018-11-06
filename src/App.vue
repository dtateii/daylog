<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      <router-link to="/log/">Log</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss">
html, body {
  background-color: $color--outer-space;
  color: white;
  @extend %type--default
}
#app {
  text-align: center;
}
#nav {
  margin: 0;
  text-align: left;
  padding: 1em;
  a {
    font-weight: bold;
    color: #94b3d1;
    margin: 0 0.3em;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
input, textarea {
  font-size: 1em;
  background: none;
  color: inherit;
  border: none;
  padding: 0.4em 1em;
}
</style>
