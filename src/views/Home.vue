<template>
  <div class="home">
    <DayLog title="Day Log" />
  </div>
</template>

<script>
// @ is an alias to /src
import DayLog from '@/components/DayLog.vue'

export default {
  name: 'home',
  components: {
    DayLog
  }
}
</script>
