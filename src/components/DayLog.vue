<template>
  <div class="daylog">
    <h2>{{title}}</h2>
    <div
      class="day"
      v-for="(logDay, key) in logDays"
      v-bind:key="key">
      <h2>{{key + 1}}</h2>
      <h3>{{logDay.name}}</h3>
      <div
      class="row"
      v-for="logEntry in logDay.entries"
      v-bind:key="logEntry.id">
        <span class="time">{{logEntry.timestamp | timeHuman}}</span>
        <input
          class="description"
          :value="logEntry.activity"
          @keyup.enter="insertLog"
          @change="updateEntry(logEntry.id, $event.target.value)"
          />
          <!-- <button
        class="insertion"
        @click.prevent="newRow">+</button> -->
      </div>
    </div>
    <div class="row">
      <ClockEntry />
    </div>
  </div>
</template>

<script>
import ClockEntry from '@/components/ClockEntry.vue'
import TimeHelper from '@/globals/timeHelper'

export default {
  name: 'DayLog',
  props: {
    logId: String
  },
  components: {
    ClockEntry
  },
  created () {
    this.$store.dispatch('auth/authenticate').then(response => {
      this.$store.dispatch('daylog/loadLogEntries')
    })
  },
  computed: {
    title: function () {
      // Use the Month name as the title
      // logId has format YYYY.MM
      let date = new Date(this.logId)
      return date.toLocaleString('en-US', {month: 'long'})
    },
    logDays: function () {
      // Create a frame for the month's days to-date.
      let days = []
      let firstDateOfMonth = new Date(this.logId)
      let dayNumToday = new Date().toLocaleString('en-US', {day: 'numeric'})
      // todo: This should conditionally limit either: num days in month, or,
      // if month-in-view is current month, limit to  num days so far in month.
      // In development, hard-coding limit to current day in current month.
      let dayLimit = dayNumToday
      // Start day numeration from first day in this month.
      let weekdayNum = firstDateOfMonth.getDay()
      for (let i = 0; i < dayLimit; i++) {
        days[i] = {
          name: TimeHelper.getWeekdayName(weekdayNum),
          entries: []
        }
        // iterate weekday number.
        if (weekdayNum === 6) {
          weekdayNum = 0
        } else {
          weekdayNum++
        }
      }
      // Get all log entries for month from store.
      let monthEntries = this.$store.getters['daylog/getLogEntries']
      // Group entries into days.
      monthEntries.forEach(function (entry) {
        // Zero sets the date to the epoch
        let date = new Date(0)
        date.setUTCSeconds(entry.timestamp.seconds)
        let day = date.toLocaleString('en-US', {day: 'numeric'})
        // todo: error handling -- can an entry exist beyond the days in the frame?
        days[day - 1].entries.push(entry)
      })
      return days
    }
  },
  methods: {
    updateEntry (entryId, entryText) {
      this.$store.dispatch('daylog/updateLogEntry', {id: entryId, activity: entryText})
    },
    insertLog () {
      // Insert a new entry field and focus to it.
      console.log('todo: insert new logEntry below current...')
    },
    newRow () {
      console.log('todo: insert new logEntry at pointer location...')
    }
  },
  filters: {
    timeHuman: function (timestamp) {
      let date = timestamp.toDate()
      let timeDisplay = date.toLocaleString('en-US', { month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })
      return timeDisplay
    }
  }
}
</script>
<style lang="scss">
.time {
    width: 128px;
    text-align: right;
    display: inline-block;
    margin-right: 1em;
}
.time.now {
  color: #ff6070;
}
.insertion {
  width: 100%;
  height: 2px;
  padding: 0;
  opacity: 0;
  &:hover {
    opacity: 1;
  }
}
</style>
