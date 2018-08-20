<template>
  <span id="nowEntry">
    <span>{{timeHuman}}</span>
    <input @keyup.enter="submit"
        name="nowTextInput"
    />
  </span>
</template>

<script>
export default {
  name: 'ClockEntry',
  data () {
    return {
      timeHuman: '',
      minuteUTC: 0
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
      var record = {
        minuteUTC: this.minuteUTC,
        text: 'test'
      }
      this.$store.commit('insert', record)
    }
  }
}
</script>

<style>
#nowEntry {
    display: inline;
}
</style>
