<template>
  <div class="logScreen">
    <Panel />
    <section id="content">
      <LogDaysList />
    </section>
  </div>
</template>

<script>
import Panel from '@/components/Panel.vue'
import LogDaysList from '@/components/LogDaysList.vue'
import TimeHelper from '@/common/timeHelper.js'

export default {
  components: {
    Panel,
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
    // Get the month name from the number
    let date = new Date(set.year + ':' + set.month)
    let monthName = date.toLocaleString('en-US', {month: 'long'})
    this.$store.commit('panel/setSuperTitle', monthName)
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
