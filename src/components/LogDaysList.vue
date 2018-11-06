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
            <span class="month-label">{{month.name}}</span>
          </div>
          <div class="day-details">
            <h3 class="day-num">{{key + 1}}</h3>
            <span class="day-name">{{logDay.name}}</span>
          </div>
        </header>
        <LogDayEntries :day="logDay.date" />
        <div
          v-if="logDay.isToday"
          class="row">
          <LogClockEntry />
        </div>
      </div>
      <!-- /Workday Wrapper -->
      <!-- Weekend Wrapper -->
      <LogOffdays v-else-if="logDay.isLastOffday" :days="logDay.offdaySeries" />
      <!-- /Weekend Wrapper -->
    </div>
  </div>
</template>

<script>
import LogClockEntry from '@/components/LogClockEntry.vue'
import LogOffdays from '@/components/LogOffdays.vue'
import LogDayEntries from '@/components/LogDayEntries.vue'

export default {
  name: 'LogDaysList',
  components: {
    LogDayEntries,
    LogClockEntry,
    LogOffdays
  },
  created: function () {
    this.$store.dispatch('daylog/loadLogDays')
    // Fetch month's entries once here, to make it available to
    // LogDayEntries component, via vuex store.
    this.$store.dispatch('daylog/loadLogEntries')
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
      return days
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
    /* Line up the right edge of the header Day Number
     * with the right edge of the entries' clock times */
    padding-left: 0.5em;
    margin-bottom: 0.6em;
  }
  .divider {
    display: flex;
  }
  .divider:after {
    content: "";
    border-bottom: 1px solid $color--algae-green;
    margin-left: 0.5em;
    width: 100%;
    height: 0.5em;
    opacity: 0.4;
  }
  .month-label {
    font-size: 0.7em;
    font-weight: bold;
    text-transform: uppercase;
    color: $color--algae-green;
    opacity: 0.8;
  }
  .day-details {
    display: flex;
    align-items: center;
    .day-num {
      display: inline-block;
      margin: 0 0.4em 0 0;
      font-size: 2em;
      font-weight: 300;
    }
    .day-name {
      text-transform: uppercase;
      opacity: 0.8;
      @include effect--transition (opacity);
    }
  }
  &.today {
    .month-label {
      color: #ccc;
    }
    .day-num,
    .day-name {
      color: $color--now;
      opacity: 1;
    }
    .divider:after {
      border-bottom: 1px solid #ccc;
    }
  }
}
.offday {
  display: inline;
}
</style>
