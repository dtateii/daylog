<template>
  <div class="daylog">
    <h2>{{title}}</h2>
    <div class="row"
      v-for="(record, key) in records"
      v-bind:key="record.id">
      <span class="time">{{key}}</span>
      <input class="description" :value="record"/>
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
    newRow () {
      console.log('todo')
    }
  }
}
</script>

<style>

</style>
