<template>
  <section class="entries">
    <div
    v-for="(entry, index) in dayEntries"
    v-bind:key="index"
    class="row">
      <span class="time">{{entry.timestamp | timeHuman}}</span>
      <input
        class="description"
        :value="entry.activity"
        @keyup.enter="insertEntry(index, $event.target)"
        @keyup.46="deleteEntry(entry.id)"
        @change="updateEntry(entry.id, $event.target.value)"
        />
        <!-- <button
      class="insertion"
      @click.prevent="newRow">+</button> -->
    </div>
  </section>
</template>

<script>
export default {
  name: 'LogDayEntries',
  props: {
    day: Date
  },
  computed: {
    dayEntries: function () {
      let monthEntries = this.$store.getters['daylog/getLogEntries']
      // Filter the month's entries to the day in view.
      return monthEntries.filter(this.dayFilter(this.day))
    }
  },
  methods: {
    updateEntry (entryId, entryText) {
      this.$store.dispatch('daylog/updateLogEntry', {id: entryId, activity: entryText})
    },
    deleteEntry (entryId) {
      this.$store.dispatch('daylog/deleteLogEntry', entryId)
    },
    insertEntry (index, target) {
      // todo: Actually, if the subsequent record has a blank activity
      // value, then don't create a new record, just focus the next
      // item.
      if ((index + 1) in this.dayEntries) {
        if (this.dayEntries[index + 1].activity === '') {
          target.parentNode.nextSibling.lastChild.focus()
          return
        }
      }
      // Insert a new entry and focus to it.
      // Use index to find current and next timestamps, then split them
      // for a reasonable guess at an initial new item timestamp.
      let timePrev = this.dayEntries[index].timestamp.seconds
      // Default the timeNext to 1 hour, in case there isn't a next time
      // entry to use. The difference will be 1/2, so this will work out
      // to defaulting to 30 minutes after the previous entry.
      let timeNext = timePrev + (60 * 60)
      // Check that a next item exists
      if ((index + 1) in this.dayEntries) {
        timeNext = this.dayEntries[index + 1].timestamp.seconds
      }
      let midway = Math.floor((timeNext - timePrev) / 2)
      // Don't jump crazy distances. If new is more than 1 hr, reduce.
      if (midway > 3600) {
        midway = 3600
      }
      let newSeconds = timePrev + midway
      // todo: fix daylight savings time issue.
      newSeconds = newSeconds + 3600
      // Firestore will take a js Date obj.
      let newDate = new Date(0)
      newDate.setSeconds(newSeconds)
      let newEntry = {activity: '', timestamp: newDate}
      // Insert entry into store, vuex and firebase will do the rest.
      this.$store.dispatch('daylog/insertLogEntry', newEntry).then(response => {
        target.parentNode.nextSibling.lastChild.focus()
      })
    },
    newRow () {
      console.log('todo: insert new logEntry at pointer location...')
    },
    dayFilter (day) {
      // Offset the date "start" epoch seconds so that a day's work can
      // be considered one day despite bleeding past midnight.
      // todo: Personalize hours offset config.
      let offset = 10800 // (3 x 60 x 60)
      let dayStart = (day.getTime() / 1000) + offset
      let dayEnd = dayStart + 86400 // (24 x 60 x 60)
      return function (value) {
        return value.timestamp.seconds >= dayStart && value.timestamp.seconds < dayEnd
      }
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

<style lang="scss" scoped>
.entries {
  margin-bottom: 2em;
  font-weight: 300;
}
.row input {
  opacity: 0.8;
  @include effect--transition (all);
  width: 80%;
  &:focus {
    outline: none;
    opacity: 1;
    color: $color--focus;
  }
  &:hover {
    opacity: 1;
  };
}

.time {
  text-align: right;
  display: inline-block;
  width: 8%;
  opacity: 0.8;
  @include effect--transition (opacity);
  &:focus {
    opacity: 1;
    color: $color--focus;
  }
  &:hover {
    opacity: 1;
  }
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
