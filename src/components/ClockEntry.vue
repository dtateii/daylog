<template>
  <span id="nowEntry">
    <span class="time now">{{timeHuman}}</span>
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
      time: '',
      timeHuman: '',
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
      this.time = new Date()
      this.timeHuman = this.time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })
    },
    submit () {
      var record = {time: this.time, activity: this.activityNow}
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
