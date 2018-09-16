<template>
  <div class="home">
    <Account />
    <DayLog logId="2018.09" />
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
