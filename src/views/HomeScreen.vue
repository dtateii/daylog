<template>
  <div class="homeScreen">
    <Panel />
    <p>This is the home screen. There's not much here.</p>
    <button @click="goToLog">Log</button>
  </div>
</template>

<script>
import Panel from '@/components/Panel.vue'

export default {
  components: {
    Panel
  },
  created () {
    this.$store.commit('panel/setSuperTitle', 'Home')
  },
  methods: {
    goToLog () {
      this.$router.push({name: 'logScreen'})
    }
  }
}
</script>
