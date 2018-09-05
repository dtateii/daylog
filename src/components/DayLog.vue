<template>
  <div class="daylog">
    <h2>{{title}}</h2>
    <div
      class="row"
      v-for="(record, key) in records"
      v-bind:key="record.id">
      <span class="time">{{key}}</span>
      <input
        class="description"
        :value="record"
        @keyup.enter="insertLog"
        @change="updateEntry(key, $event.target.value)"
        />
    </div>
    <button @click.prevent="newRow">+</button>
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
  data () {
    return {}
  },
  created () {
    this.$store.dispatch('loadRecords')
  },
  computed: {
    records: function () {
      return this.$store.getters.getRecords
    }
  },
  methods: {
    updateEntry (key, value) {
      let log = { 'key': key, 'value': value }
      this.$store.dispatch('updateEntry', log)
    },
    insertLog () {
      // Insert a new entry field and focus to it.
      console.log('todo: insert new record below current...')
    },
    newRow () {
      console.log('todo: insert new record at pointer location...')
    }
  }
}
</script>

<style>

</style>
