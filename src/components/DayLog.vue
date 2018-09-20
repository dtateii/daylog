<template>
  <div class="daylog">

    <div
      v-for="(logDay, key) in logDays"
      v-bind:key="key"
      class="day"
      v-bind:class="{today: logDay.isToday}">
      <!-- /Workday Wrapper -->
      <div
        v-if="logDay.isWorkday"
        class="workday">
        <header>
          <div class="divider">
            <span class="monthLabel">{{monthName}}</span>
          </div>
          <div class="dayDetails">
            <h3 class="dayNum">{{key + 1}}</h3>
            <span class="dayName">{{logDay.name}}</span>
          </div>
        </header>
        <section class="entries">
          <div
            v-for="logEntry in logDay.entries"
            v-bind:key="logEntry.id"
            class="row">
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
          <div
            v-if="logDay.isToday"
            class="row">
            <ClockEntry />
          </div>
        </section>
      </div>
      <!-- /Workday Wrapper -->
      <!-- Weekend Wrapper -->
      <OffDays v-else-if="logDay.isLastOffday" :days="logDay.offdaySeries" />
      <!-- /Weekend Wrapper -->
    </div>
  </div>
</template>

<script>
import ClockEntry from '@/components/ClockEntry.vue'
import OffDays from '@/components/OffDays.vue'
import TimeHelper from '@/globals/timeHelper'

export default {
  name: 'DayLog',
  props: {
    logId: String
  },
  components: {
    ClockEntry,
    OffDays
  },
  created () {
    this.$store.dispatch('auth/authenticate').then(response => {
      this.$store.dispatch('daylog/loadLogEntries')
    })
  },
  computed: {
    monthName: function () {
      // logId has format YYYY.MM
      let date = new Date(this.logId)
      return date.toLocaleString('en-US', {month: 'long'})
    },
    logDays: function () {
      // Create a frame for the month's days to-date.
      let days = []
      // Series of non-workdays (usually weekends) are "offdays" and
      // group together for minimized, unified presentation.
      let offdaySeries = []
      let firstDateOfMonth = new Date(this.logId)
      let dayNumToday = new Date().toLocaleString('en-US', {day: 'numeric'})
      // todo: This should conditionally limit either: num days in month, or,
      // if month-in-view is current month, limit to  num days so far in month.
      // In development, hard-coding limit to current day in current month.
      let dayLimit = dayNumToday // todo
      let currentMonth = true // todo
      // Start day numeration from first day in this month.
      let weekdayNum = firstDateOfMonth.getDay()
      for (let i = 0; i < dayLimit; i++) {
        // Pass log entries and set other props.
        // isToday says if this day in iteration is the actual day today.
        // All days are considered either "workdays" or "offdays".
        // isWorkday defaults to true on M-F and false on Sa-Su.
        days[i] = {
          name: TimeHelper.getWeekdayName(weekdayNum),
          entries: [],
          isToday: currentMonth && i === (dayNumToday - 1),
          isWorkday: weekdayNum > 0 && weekdayNum < 6
        }
        // Consecutive non-workdays are grouped together for different display.
        if (days[i].isWorkday) {
          // Any occurrence of a workday should reset the current series of offdays.
          offdaySeries = []
        } else {
          // Add this day to the current unbroken series of Offdays.
          // The series only needs the names of the days in it.
          offdaySeries.push({
            name: days[i].name,
            dayNum: i + 1
          })
          // Assume each non-workday will be the last non-workday in a series.
          days[i].isLastOffday = true
          // Each consecutive non-workday should unmake the previous assumption
          // such that a string of non-work days flags only the last one as 'last'.
          let previous = i - 1
          if (previous >= 0) {
            if (!days[previous].isWorkday) {
              days[previous].isLastOffday = false
              // Likewise, remove the unnecessary series attachment.
              delete days[previous].offdaySeries
            }
          }
          // Attach the current series to this offday.
          days[i].offdaySeries = offdaySeries
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
      // Group month's entries into days.
      monthEntries.forEach(function (entry) {
        // Zero sets the date to the epoch
        let date = new Date(0)
        date.setUTCSeconds(entry.timestamp.seconds)
        let day = date.toLocaleString('en-US', {day: 'numeric'})
        // todo: error handling -- can an entry exist beyond the days in the frame?
        days[day - 1].entries.push(entry)
        // Change weekend days back to "WorkDays" if there are entries logged.
        // todo: This messes up the "isLastOffday" approached used to manage a series...
        // if (!days[day - 1].isWorkday) {
        //   days[day - 1].isWorkday = true
        // }
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
      let timeDisplay = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
      // Remove am/pm: todo: Note this will probably screw up other locales...
      timeDisplay = timeDisplay.slice(0, -3)

      return timeDisplay
    }
  }
}
</script>
<style lang="scss">
.daylog {
  text-align: left;
  margin: auto;
  min-width: 320px;
  max-width: 470px;
  padding-bottom: 10em;
}
.day {
  & header {
    color: white;
  }
  .divider {
    opacity: 0.5;
    display: flex;
  }
  .divider:after {
    content: "";
    border-bottom: 1px solid;
    margin-left: 0.5em;
    width: 100%;
    height: 0.5em;
  }
  .monthLabel {
    font-size: 0.7em;
    font-weight: bold;
    text-transform: uppercase;
  }
  .dayDetails {
    display: flex;
    align-items: center;
    .dayNum {
      display: inline-block;
      margin: 0 0.4em 0 0;
      font-size: 2em;
      font-weight: 100;
    }
    .dayName {
      text-transform: uppercase;
      font-weight: 100;
    }
  }
  &.today .dayDetails .dayNum,
  &.today .dayDetails .dayName {
    color: #ff6070;
  }
  .entries {
    margin-bottom: 2em;
  }
}

.time {
    text-align: right;
    display: inline-block;
    margin-right: 0.1em;
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
.offday {
  display: inline;
}
</style>
