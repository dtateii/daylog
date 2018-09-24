<template>
  <section class="entries">
    <div
    v-for="entry in dayEntries"
    v-bind:key="entry.id"
    class="row">
      <span class="time">{{entry.timestamp | timeHuman}}</span>
      <input
        class="description"
        :value="entry.activity"
        @keyup.enter="insertLog"
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
    insertLog () {
      // Insert a new entry field and focus to it.
      console.log('todo: insert new logEntry below current...')
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
  @include effect-transition (all);
  width: 80%;
  &:focus {
    outline: none;
    opacity: 1;
    color: $color-focus;
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
  @include effect-transition (opacity);
  &:focus {
    opacity: 1;
    color: $color-focus;
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
