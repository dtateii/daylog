<template>
  <section class="entries">
    <div
      v-for="(entry, index) in dayEntries"
      v-bind:key="index"
      class="row">
      <div
        class="entry">
        <input
          :value="entry.timestamp | timeHuman"
          @keydown.up.prevent="timeUp(index)"
          @keydown.down.prevent="timeDown(index)"
          class="time" />
        <input
          v-model="entry.activity"
          ref="activities"
          @change="updateEntry(index)"
          @blur="cleanUp(index)"
          @keydown.enter.prevent="splitOrNext(index)"
          @keydown.up.prevent="goUp(index)"
          @keydown.down.prevent="goDown(index)"
          placeholder="Activity..."
          class="description" />
      </div>
    </div>
    <div
      v-if="dayEntries.length === 0"
      class="row">
      <div class="entry empty">
        <input
          @keyup.enter="insertEntry(0, $event.target.value)"
          @change="insertEntry(0, $event.target.value)"
          placeholder="+ Add Entry"
          class="first-entry" />
      </div>
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
    splitOrNext (index) {
      // This moves the cursor position and breaks lines
      // if necessary. Note, do not update the entry --
      // the change event will also fire since the focus
      // changes, which would call it twice.
      // Split the entry value at the caret.
      let cpos = this.$refs.activities[index].selectionStart
      let text = this.dayEntries[index].activity
      let textLeft = text.substr(0, cpos).trim()
      let textRight = text.substr(cpos).trim()
      // Update the current entry value.
      this.dayEntries[index].activity = textLeft
      // Update needs to be called because the element change
      // function isn't triggered by the Vue component value
      // changing.
      this.updateEntry(index)
      // A new entry should be inserted. It may be empty or not.
      this.insertEntry(index, textRight)
    },
    cleanUp (index) {
      // This fires on blur. Empty records must be deleted.
      if (!(index in this.dayEntries)) {
        console.log('Entry at index ' + index + ' does not exist to clean up.')
        return
      }
      let entry = this.dayEntries[index]
      // If the input is empty, delete the record.
      if (entry.activity === '') {
        this.deleteEntry(entry.id)
        // todo: put the cursor someplace useful.
      }
    },
    updateEntry (index) {
      // This is called on change. This always fires simultaneously
      // with on blur cleanUp method.
      if (!(index in this.dayEntries)) {
        console.log('Entry at index ' + index + 'doesnt exist to update.')
        return
      }
      let entry = this.dayEntries[index]
      // If the input is empty do nothing. This is important because
      // blur cleanUp is handling removing the record, so dont
      // try to delete again or update a deleted record.
      if (entry.activity === '') {
        return
      }
      // Update the changed value in the store.
      this.$store.dispatch('daylog/updateLogEntry', entry)
    },
    deleteEntry (entryId) {
      this.$store.dispatch('daylog/deleteLogEntry', entryId)
    },
    goUp (index) {
      // Go up an entry, if possible.
      if (index > 0) {
        let caretPosition = this.$refs.activities[index].selectionStart
        this.$refs.activities[index - 1].focus()
        this.$refs.activities[index - 1].setSelectionRange(caretPosition, caretPosition)
      } else {
        // todo: maybe jump up to previous day?
      }
    },
    goDown (index) {
      // Go down an entry, if possible.
      if (index < (this.$refs.activities.length - 1)) {
        let caretPosition = this.$refs.activities[index].selectionStart
        this.$refs.activities[index + 1].focus()
        this.$refs.activities[index + 1].setSelectionRange(caretPosition, caretPosition)
      } else {
        // todo: maybe break down to next day?
      }
    },
    timeUp (index) {
      this.dayEntries[index].timestamp.seconds += 360
      this.dayEntries.filter(this.dayFilter(this.day))
    },
    timeDown (index) {
      this.dayEntries[index].timestamp.seconds -= 360
    },
    insertEntry (index, text = '') {
      // If the subsequent record has a blank activity value, then
      // do not insert a new entry, simply focus to the next one.
      if ((index + 1) in this.dayEntries) {
        if (this.dayEntries[index + 1].activity === '') {
          this.$refs.activities[index + 1].focus()
        }
      }
      // Insert a new entry and focus to it.
      // Use index to find current and next timestamps, then split them
      // for a reasonable guess at an initial new item timestamp.
      let newDate = new Date(0)
      let secondsInit = 0
      if (index in this.dayEntries) {
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
        // The new seconds calculation is the last time plus the midway point
        // between that and the next entry.
        secondsInit = timePrev + midway
      } else {
        // This may be the first record for the day. Default to morning.
        let defaultSeconds = 3600 * 8
        secondsInit = Math.floor(this.day.getTime() / 1000) + defaultSeconds
      }
      // Forward the seconds to the desired date and time.
      // todo: fix daylight savings time issue, see .getTimezoneOffset()
      secondsInit += 3600
      newDate.setSeconds(secondsInit)
      // Firestore will take a js Date obj.
      let newEntry = {activity: text, timestamp: newDate}
      // Insert entry into store. Once it is inserted, focus to it.
      this.$store.dispatch('daylog/insertLogEntry', newEntry).then(response => {
        // Try to focus to the new input.
        // this.$refs.activities[index + 1].focus()
        // this.$refs.activities[index + 1].setSelectionRange(0, 0)
      })
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
  },
  destroyed () {
    // todo: necessary to remove keyup event listeners?
  }
}
</script>

<style lang="scss" scoped>
.entries {
  margin-bottom: 2em;
  font-weight: 300;
}
.entry {
  display: flex;
  input {
    opacity: 0.8;
    padding: 0.5em;
    @include effect--transition (all);
    &:focus {
      outline: none;
      opacity: 1;
      color: $color--focus;
      text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.4);
    }
    &:hover {
      opacity: 1;
    }
    &::selection { background: $color--algae-green; color: white; }
    &.time {
      width: 8%;
      text-align: right;
    }
    &.description {
      flex: 1;
    }
  }
  &.empty {
    opacity: 0;
    @include effect--transition (opacity);
    &:focus-within,
    &:hover {
      opacity: 1;
    }
  }
}
.insertion {
  cursor: pointer;
  width: 100%;
  height: 1em;
  padding: 0;
  opacity: 0.5;
  @include effect--transition (all);
  &:hover {
    opacity: 1;
    height: 2em;
  }
}
</style>
