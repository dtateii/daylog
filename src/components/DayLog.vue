<template>
  <div class="daylog">
    <h2>{{title}}</h2>
    <div
      class="row"
      v-for="record in records"
      v-bind:key="record.id">
      <span class="time">{{record.time | timeHuman}}</span>
      <input
        class="description"
        :value="record.activity"
        @keyup.enter="insertLog"
        @change="updateEntry(record.id, $event.target.value)"
        />
        <!-- <button
      class="insertion"
      @click.prevent="newRow">+</button> -->
    </div>
    <div class="row">
      <ClockEntry />
    </div>
  </div>
</template>

<script>
import ClockEntry from '@/components/ClockEntry.vue'

export default {
  name: 'DayLog',
  props: {
    title: String
  },
  components: {
    ClockEntry
  },
  created () {
    this.$store.dispatch('auth/authenticate').then(response => {
      this.$store.dispatch('daylog/loadRecords')
    })
  },
  computed: {
    records: function () {
      return this.$store.getters['daylog/getRecords']
    }
  },
  methods: {
    updateEntry (entryId, entryText) {
      this.$store.dispatch('daylog/updateEntry', {id: entryId, activity: entryText})
    },
    insertLog () {
      // Insert a new entry field and focus to it.
      console.log('todo: insert new record below current...')
    },
    newRow () {
      console.log('todo: insert new record at pointer location...')
    }
  },
  filters: {
    timeHuman: function (timestamp) {
      let date = timestamp.toDate()
      let timeDisplay = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })
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
