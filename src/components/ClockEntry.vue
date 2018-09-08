<template>
  <span id="nowEntry">
    <span>{{timeHuman}}</span>
    <input @keyup.enter="submit"
         v-model="activityNow"
         placeholder="Activity..."
    />
  </span>
</template>

<script>
export default {
  name: 'ClockEntry',
  data () {
    return {
      timeHuman: '',
      minuteUTC: 0,
      activityNow: ''
    }
  },
  created () {
    setInterval(this.updateTime, 1000)
    this.updateTime()
    return {
      records: this.$store.getters.records
    }
  },
  methods: {
    updateTime () {
      var time = new Date()
      this.minuteUTC = time.getUTCMinutes() + (time.getUTCHours() * 60)
      this.timeHuman = time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })
    },
    submit () {
      var record = {[this.minuteUTC]: this.activityNow}
      this.$store.dispatch('daylog/insertEntry', record)
    }
  }
}
</script>

<style>
#nowEntry {
    display: inline;
}
</style>
