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
@mixin border-radii($topleft, $topright, $bottomright, $bottomleft) {
  border-top-left-radius: $topleft;
  border-top-right-radius: $topright;
  border-bottom-right-radius: $bottomright;
  border-bottom-left-radius: $bottomleft;
  -webkit-border-top-left-radius: $topleft;
  -webkit-border-top-right-radius: $topright;
  -webkit-border-bottom-right-radius: $bottomright;
  -webkit-border-bottom-left-radius: $bottomleft;
  -moz-border-radius-topleft: $topleft;
  -moz-border-radius-topright: $topright;
  -moz-border-radius-bottomright: $bottomright;
  -moz-border-radius-bottomleft: $bottomleft;
}
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
  border: 1px solid #fff;
  border-left: 0;
  background: rgba(124,124,124,0.6);
  color: #fff;
  &:first-child {
    border-left: 1px solid #ccc;
    @include border-radii(2em, 0, 0, 2em)
  }
  &:last-child {
    @include border-radii(0, 2em, 2em, 0)
  }
  &:hover {
    opacity: 0.8;
  }
}
</style>
