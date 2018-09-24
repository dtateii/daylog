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
        <LogDayEntries :day="logDay.date" />
        <div
          v-if="logDay.isToday"
          class="row">
          <ClockEntry />
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
import ClockEntry from '@/components/ClockEntry.vue'
import LogOffdays from '@/components/LogOffdays.vue'
import LogDayEntries from '@/components/LogDayEntries.vue'

export default {
  name: 'LogDaysList',
  components: {
    LogDayEntries,
    ClockEntry,
    LogOffdays
  },
  created: function () {
    this.$store.dispatch('daylog/loadLogDays')
    // Auth user and fetch month's entries once here, to make it
    // available to LogDayEntries component, via vuex store.
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
}
.offday {
  display: inline;
}
</style>
