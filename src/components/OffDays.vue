<template>
  <div class="offdays">
    <div
    v-for="(day, key) in days"
    v-bind:key="key"
    @click="insert(day)"
    class="button offday">
      <span v-if="isLast(key)">{{day.name}} +</span>
      <span v-else>+ {{day.name}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OffDays',
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
.button {
  cursor: pointer;
}
.offday {
  opacity: 0.6;
  padding: 0.5em;
  flex: 1 1;
  text-align: center;
  border: 1px solid rgba(200,200,200,0.5);
  border-left: 0;
  background: rgba(124,124,124,0.4);
  color: #fff;
  &:first-child {
    border-left: 1px solid #ccc;
    @include border-radii-left(2em, 2em)
  }
  &:last-child {
    @include border-radii-right(2em, 2em)
  }

  &:hover {
    opacity: 0.9;
  }
}
</style>
