<template>
  <header id="panel" v-bind:class="{ expanded: isExpanded }">
    <section class="contract">
      <button @click="panelExpand($event)" class="hamburger hamburger--minus" type="button">
        <span class="hamburger-box">
          <span class="hamburger-inner"></span>
        </span>
      </button>
      <h1>{{superTitle}}</h1>
      <v-select
        :options="sets"
        :value="currentSetNumber"
        @input="changeSet"></v-select>
    </section>
    <section v-show="isExpanded" class="adv">
      <nav id="nav">
        <router-link to="/">Home</router-link>
        <router-link to="/log/">Log</router-link>
      </nav>
      <Account />
    </section>
  </header>
</template>

<script>
import Account from '@/components/Account.vue'
import VueSelect from 'vue-select'
import TimeHelper from '@/common/timeHelper'

export default {
  components: {
    Account,
    'v-select': VueSelect
  },
  data () {
    return {
      isExpanded: false
    }
  },
  computed: {
    title () {
      return this.$store.state.panel.title
    },
    superTitle () {
      return this.$store.state.panel.superTitle
    },
    sets () {
      return TimeHelper.getMonthsOptions()
    },
    currentSetNumber () {
      return this.$store.state.daylog.month
    }
  },
  methods: {
    changeSet (opt) {
      if (opt.value) {
        this.$router.push('/log/2018/' + opt.value)
      }
    },
    panelExpand (e) {
      e.stopPropagation()
      // Toggle hamburger icon appearance.
      e.currentTarget.classList.toggle('is-active')
      if (this.isExpanded) {
        this.isExpanded = false
      } else {
        this.isExpanded = true
      }
    }
  }
}
</script>

<style lang="scss">
$color--hamburger: lighten($color--bg, 40%);

#panel {
  background: darken($color--bg, 6%);
  // position: -webkit-sticky;
  // position: sticky;
  top: -3em;
  padding: 1em;
  .adv {
    position: relative; /* trap abs pos children */
    min-height: 86px;
  }
  .sticky {
    padding-top: 1em;
  }
  h1, h2, h3 {margin: 0; text-transform: uppercase;}
  h1 {
    font-size: 1.4em;
  }
  h2 {
    font-size: 1.2em;
    font-weight: 300;
  }
  &:hover .hamburger {
    opacity: 0.7;
  }
  &.expanded .hamburger {
    opacity: 0.7;
  }
}
#nav {
  margin: 0;
  text-align: left;
  padding: 1em;
  a {
    font-weight: bold;
    color: #94b3d1;
    margin: 0 0.3em;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

/* https://github.com/jonsuh/hamburgers/ */
.hamburger {
  opacity: 0;
  position: absolute;
  top: 1em;
  right: 1em;
  outline: none;
  display: inline-block;
  cursor: pointer;
  transition-property: opacity, filter;
  transition-duration: 0.15s;
  transition-timing-function: linear;
  font: inherit;
  color: inherit;
  text-transform: none;
  background-color: transparent;
  border: 0;
  margin: 0;
  overflow: visible; }
  .hamburger:hover {
    opacity: 1; }
  .hamburger.is-active:hover {
    opacity: 1; }
  .hamburger.is-active .hamburger-inner,
  .hamburger.is-active .hamburger-inner::before,
  .hamburger.is-active .hamburger-inner::after {
    background-color: $color--hamburger; }

.hamburger-box {
  width: 1em;
  display: inline-block;
  position: relative; }

.hamburger-inner {
  display: block;
  top: 50%;
  margin-top: 0px; }
  .hamburger-inner, .hamburger-inner::before, .hamburger-inner::after {
    width: 1em;
    height: 2px;
    background-color: $color--hamburger;
    position: absolute;
    transition-property: transform;
    transition-duration: 0.15s;
    transition-timing-function: ease; }
  .hamburger-inner::before, .hamburger-inner::after {
    content: "";
    display: block; }
  .hamburger-inner::before {
    top: -6px; }
  .hamburger-inner::after {
    bottom: -6px; }

.hamburger--minus .hamburger-inner::before, .hamburger--minus .hamburger-inner::after {
  transition: bottom 0.08s 0s ease-out, top 0.08s 0s ease-out, opacity 0s linear; }

.hamburger--minus.is-active .hamburger-inner::before, .hamburger--minus.is-active .hamburger-inner::after {
  opacity: 0;
  transition: bottom 0.08s ease-out, top 0.08s ease-out, opacity 0s 0.08s linear; }

.hamburger--minus.is-active .hamburger-inner::before {
  top: 0; }

.hamburger--minus.is-active .hamburger-inner::after {
  bottom: 0; }

/* Month/Title dropdown picker */
.dropdown {
  width: 50%;
  height: 2em;
  outline: none;
  top: -2em; /* Pull up on top of title */
  margin: 0 auto -2em auto;
}
.v-select.searchable .dropdown-toggle,
.v-select input {
  opacity: 0;
  cursor: pointer;
}
</style>
