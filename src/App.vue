<template>
  <div id="app">
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
  @extend %type--default;
  margin: 0;
}
#app {
  text-align: center;
}
input, textarea {
  font-size: 1em;
  background: none;
  color: inherit;
  border: none;
  padding: 0.4em 1em;
}
body::-webkit-scrollbar {
    width: 0.5em;
}
body::-webkit-scrollbar-thumb {
  background-color: lighten($color--bg, 20%)
}
</style>
