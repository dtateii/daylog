<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      <router-link to="/log">Log</router-link>
      <router-link to="/auth">Auth</router-link>
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
  background-color: $color-outer-space;
  color: $color-dawn;
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 11pt;
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
  font-family: monospace;
  background: none;
  color: inherit;
  border: none;
  padding: 0.4em 1em;
  &:hover {
    background: $color-lighten;
  }
}
</style>
