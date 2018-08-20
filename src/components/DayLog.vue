<template>
  <div class="daylog">
    <h2>{{title}}</h2>
    <div class="row"
      v-for="record in records"
      v-bind:key="record.id">
      <span class="time">{{record}}</span>
      <input class="description" />
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
    return {
      records: []
    }
  },
  created () {
    return {
      records: this.$store.getters.records
    }
  },
  methods: {
    newRow () {
      // this.records.push({id: 670, timeHuman: '9:45 am'})
      console.log(this.$store)
    }
  }
}
</script>

<style>

</style>
