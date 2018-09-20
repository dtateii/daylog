<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
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
  background-color:#2e353f;
  color: #c6b5a3;
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
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
input, textarea, select, button {
  background: none;
  color: inherit;
  border: none;
  padding: 0.4em 1em;
  &:hover {
    background: rgba(200,230,255,0.05)
  }
  font-size: 1em;
}
</style>
