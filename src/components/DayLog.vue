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
            <span class="monthLabel">{{month.name}}</span>
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
import TimeHelper from '@/common/timeHelper'

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
    logSet: function () {
      // logId has format YYYY.MM
      return new Date(this.logId)
    },
    now: function () {
      let date = new Date()
      return {
        month: {
          name: date.toLocaleString('en-US', {month: 'long'}),
          num: parseInt(date.toLocaleString('en-US', {month: 'numeric'}))
        },
        day: {
          name: TimeHelper.getWeekdayName(date.getDay()),
          num: parseInt(date.toLocaleString('en-US', {day: 'numeric'}))
        }
      }
    },
    month: function () {
      return {
        name: this.logSet.toLocaleString('en-US', {month: 'long'}),
        num: parseInt(this.logSet.toLocaleString('en-US', {month: 'numeric'}))
      }
    },
    year: function () {
      return this.logSet.toLocaleString('en-US', {year: 'numeric'})
    },
    logDays: function () {
      // This function will ultimately return this array of day objects.
      let days = []

      // Get from the store all the log entries for this month.
      let monthEntries = this.$store.getters['daylog/getLogEntries']

      // Group the entries into days.
      let entries = {}
      monthEntries.forEach(function (entry) {
        // Pull the day number from the entry timestamp.
        let date = new Date(0) // Zero sets the date to the epoch
        date.setUTCSeconds(entry.timestamp.seconds)
        let entryDayNum = date.toLocaleString('en-US', {day: 'numeric'})
        entries[entryDayNum] = entries[entryDayNum] || []
        entries[entryDayNum].push(entry)
      })

      // Construct the calendar of days for this month log set.
      // Calculate the number of days in the logset month:
      // https://www.bennadel.com/blog/3311-using-the-joyous-power-of-relative-dates-to-calculate-days-in-month-in-javascript.htm
      let daysInMonth = new Date(this.year, (this.month.num), 0).getDate()
      let lastDay = daysInMonth
      // If the month in set is the current calendar month, then extend
      // only to the current day.
      if (this.isCurrentMonth()) {
        // Today's day number is the limit to which the set should extend.
        lastDay = this.now.day.num
      }

      // Series of non-workdays (usually weekends) are "offdays" and
      // group together for minimized, unified presentation.
      let offdaySeries = []
      // Begin weekday enumeration from first day in the set month.
      let weekdayNum = this.logSet.getDay()

      // Loop: Build out each day's properties
      for (let i = 0; i < lastDay; i++) {
        // All days are considered either "workdays" or "offdays".
        // Default "workdays" are M-F, "offdays" are Sa-Su, derived
        // from the weekday number, except if the day has entries
        // attached, then it's always a workday no matter what.
        // Assume no entries by default.
        let hasEntries = false
        if (i + 1 in entries) {
          hasEntries = true
        }

        days[i] = {
          name: TimeHelper.getWeekdayName(weekdayNum),
          isToday: this.isCurrentMonth() && i === (this.now.day.num - 1),
          isWorkday: (weekdayNum > 0 && weekdayNum < 6) || hasEntries
        }
        // Add entries if they exist
        if (hasEntries) {
          days[i].entries = entries[i + 1]
        }

        // Handle offday series (aka weekends) grouping.
        // Initially assume every non-workday will be the last one in a series.
        days[i].isLastOffday = true

        // Consecutive non-workdays are grouped together for different display.
        if (days[i].isWorkday) {
          // Any occurrence of a workday should reset the current series of offdays.
          offdaySeries = []
        } else {
          // Add this offday to the current unbroken series of offdays.
          // The series only needs the names of the days in it.
          offdaySeries.push({
            name: days[i].name,
            dayNum: i + 1
          })
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

        // Increment the weekday number.
        weekdayNum === 6 ? weekdayNum = 0 : weekdayNum++
      }
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
    },
    isCurrentMonth () {
      return this.month.num === this.now.month.num
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
    color: $color-algae-green;
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
      font-weight: 300;
      opacity: 0.8;
    }
  }
  &.today {
    .monthLabel {
      color: #ccc;
    }
    .dayNum,
    .dayName {
      color: $color-now;
    }
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
