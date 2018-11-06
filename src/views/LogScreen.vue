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
  beforeRouteUpdate (to, from, next) {
    let set = {
      year: to.params.year,
      month: to.params.month
    }
    this.load(set)
    next()
  },
  created () {
    // On load, either use the route params or default to current
    // period if there aren't any route params passed in.
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
    this.load(set)
  },
  methods: {
    load (set) {
      // Set in store the year/month log set on screen
      this.$store.dispatch('daylog/selectLog', set)
      // Get the days of the month corresponding to this log set.
      this.$store.dispatch('daylog/loadLogDays')
      // Retrieve from firestore the entries for the log on screen.
      this.$store.dispatch('daylog/loadLogEntries')
    }
  }
}
</script>
