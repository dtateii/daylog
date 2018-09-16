<template>
  <span id="nowEntry">
    <span class="time now">{{timeHuman}}</span>
    <input @keyup.enter="submit"
         v-model="activity"
         placeholder="Activity..."
    />
  </span>
</template>

<script>
export default {
  name: 'ClockEntry',
  data () {
    return {
      date: '',
      timeHuman: '',
      activity: ''
    }
  },
  created () {
    setInterval(this.updateTime, 1000)
    this.updateTime()
    return {
      logEntries: this.$store.getters.getLogEntries
    }
  },
  methods: {
    updateTime () {
      this.date = new Date()
      this.timeHuman = this.date.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true})
    },
    submit () {
      // Pass Date to Firestore. It will convert JS Date to Firebase Timestamp.
      let logEntry = {timestamp: this.date, activity: this.activity}
      this.$store.dispatch('daylog/insertLogEntry', logEntry)
    }
  }
}
</script>

<style>
#nowEntry {
    display: inline;
}
</style>
