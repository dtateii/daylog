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
            v-for="entry in logDay.entries"
            v-bind:key="entry.id"
            class="row">
            <span class="time">{{getEntry(entry.entryId).timestamp | timeHuman}}</span>
            <input
              class="description"
              :value="getEntry(entry.entryId).activity"
              @keyup.enter="insertLog"
              @change="updateEntry(entry.entryId, $event.target.value)"
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
      <LogOffdays v-else-if="logDay.isLastOffday" :days="logDay.offdaySeries" />
      <!-- /Weekend Wrapper -->
    </div>
  </div>
</template>

<script>
import ClockEntry from '@/components/ClockEntry.vue'
import LogOffdays from '@/components/LogOffdays.vue'

export default {
  name: 'LogDaysList',
  components: {
    ClockEntry,
    LogOffdays
  },
  created: function () {
    this.$store.dispatch('daylog/loadLogDays')
    this.$store.dispatch('auth/authenticate').then(response => {
      this.$store.dispatch('daylog/loadLogEntries')
    })
  },
  computed: {
    month: function () {
      let date = new Date(this.$store.state.daylog.year + ':' + this.$store.state.daylog.month)
      return {
        name: date.toLocaleString('en-US', {month: 'long'}),
        num: this.$store.state.daylog.month
      }
    },
    logEntries: function () {
      return this.$store.getters['daylog/getLogEntries']
    },
    logDays: function () {
      // Calendar the days of the month.
      let days = this.$store.getters['daylog/getLogDays']
      let entries = this.logEntries
      entries.forEach(function (entry) {
        // Pull the day number from the entry timestamp.
        let date = new Date(0) // Zero sets the date to the epoch
        date.setUTCSeconds(entry.timestamp.seconds)
        let entryDayNum = date.toLocaleString('en-US', {day: 'numeric'})
        let index = entryDayNum - 1
        days[index].entries = days[index].entries || []
        // todo: smarter way to not duplicate references on every state change?
        if (!days[index].entries.find(d => d.entryId === entry.id)) {
          days[index].entries.push({entryId: entry.id})
        }
        // Any day with entries is treated as a 'workday'.
        if (!days[index].isWorkday) {
          days[index].isWorkday = true
          // Seek to end of the offday series, and remove from it
          // the offday that was just converted to a workday.
          let seeking = true
          let offset = 1
          do {
            if ('offdaySeries' in days[index + offset]) {
              // todo: This only works on the first item...
              days[index + offset].offdaySeries.shift()
              seeking = false
            }
            offset++
          } while (seeking)
        }
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
    },
    getEntry (id) {
      return this.logEntries.find(entry => entry.id === id)
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

.row input {
  &:focus {
    outline: none;
  }
  &:hover {
    background: none;
  };
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
