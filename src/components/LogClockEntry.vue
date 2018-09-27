<template>
  <span id="now-entry">
    <span class="time">{{timeHuman}}</span>
    <input @keyup.enter="submit()"
      v-model="activity"
      placeholder="Activity..."
      class="activity"
    />
  </span>
</template>

<script>
export default {
  name: 'LogClockEntry',
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
      // Clear the input field
      this.activity = ''
    }
  }
}
</script>

<style lang="scss">
#now-entry {
  display: flex;
  .time {
    color: $color--now;
    width: 6em;
    margin-right: 1em;
  }
  .activity {
    padding: 0;
    flex: 1;
    outline: none;
  }
}
</style>
