<template>
  <div class="offdays">
    <div
    v-for="(day, key) in days"
    v-bind:key="key"
    @click="insert(day)"
    class="control-button--multi">
      <span v-if="isLast(key)">{{day.name}} +</span>
      <span v-else>+ {{day.name}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LogOffdays',
  props: {
    days: Array
  },
  methods: {
    isLast (key) {
      return key === (this.days.length - 1)
    },
    insert (day) {
      // todo:
      console.log('Insert ' + day.name + ' (' + day.dayNum + ')')
    }
  }
}
</script>

<style lang="scss" scoped>
.offdays {
  display: flex;
  margin: 2em 2em 3em;
}
</style>
