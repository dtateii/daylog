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
          @keyup.enter="updateEntry(index, true)"
          @change="updateEntry(entry)"
          @keydown.up.prevent="goUp(index)"
          @keydown.down.prevent="goDown(index)"
          @blur="cleanUp(index)"
          placeholder="Activity..."
          class="description" />
      </div>
    </div>
    <div
      v-if="dayEntries.length === 0"
      class="row">
      <div class="entry empty">
        <input
          class="description"
          value=""
          placeholder="+ Add Entry"
          @keyup.enter="insertEntry(0, $event.target)"
          @change="updateEntry(0, $event.target.value)" />
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
    updateEntry (index, returnPressed = false) {
      let entry = this.dayEntries[index]
      // If return key was pressed, user might intend to:
      // 1: Split the current line to two lines.
      // 2: Explicitly save the current input value.
      if (returnPressed) {
        // Split the entry value at the caret.
        let cpos = this.$refs.activities[index].selectionStart
        let text = this.dayEntries[index].activity
        let textLeft = text.substr(0, cpos).trim()
        let textRight = text.substr(cpos).trim()
        // Update the current entry
        entry.activity = textLeft
        // If there is anything to the right, a new entry should
        // be inserted.
        if (textRight) {
          this.insertEntry(index, textRight)
        }
      }
      // Update the current entry
      // todo skip this if nothing changed?
      this.$store.dispatch('daylog/updateLogEntry', entry)
    },
    deleteEntry (entryId) {
      this.$store.dispatch('daylog/deleteLogEntry', entryId)
    },
    cleanUp (index) {
      // If the input is empty, remove the record.
      if (index in this.dayEntries) {
        if (this.dayEntries[index].activity === '') {
          this.deleteEntry(this.dayEntries[index].id)
        }
      }
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
      let newEntry = {activity: text, timestamp: newDate}
      // Insert entry into store. Once it is inserted, focus to it.
      this.$store.dispatch('daylog/insertLogEntry', newEntry).then(response => {
        // Try to focus to the new input.
        this.$refs.activities[index + 1].focus()
        this.$refs.activities[index + 1].setSelectionRange(0, 0)
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
