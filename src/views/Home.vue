<template>
  <div class="home">
    <Account />
    <DayLog title="Day Log" />
  </div>
</template>

<script>
import Account from '@/components/Account.vue'
import DayLog from '@/components/DayLog.vue'

export default {
  name: 'home',
  components: {
    Account,
    DayLog
  }
}
</script>

<style lang="scss" scoped>

</style>
