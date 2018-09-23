<template>
  <div class="logScreen">
    <Account />
    <LogDaysList />
  </div>
</template>

<script>
import Account from '@/components/Account.vue'
import LogDaysList from '@/components/LogDaysList.vue'
import TimeHelper from '@/common/timeHelper.js'

export default {
  components: {
    Account,
    LogDaysList
  },
  created () {
    // Store the year and month values for the currently
    // loaded log screen.
    // If route params are absent, load current month.
    let set = {}
    if (this.$route.params.year && this.$route.params.month) {
      set = {
        year: parseInt(this.$route.params.year),
        month: parseInt(this.$route.params.month)
      }
    } else {
      set = {
        year: TimeHelper.getNow().year,
        month: TimeHelper.getNow().month.num
      }
    }
    this.$store.dispatch('daylog/selectLog', set)
  }
}
</script>
