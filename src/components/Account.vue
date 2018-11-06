<template>
  <div id="account">
    <div v-if="user.displayName">
     <span
     class="avatar"
     :style="photoBg"></span>
     <button @click='signout'>Sign Out</button>
    </div>
    <div v-else>
      <button @click='signin'>Sign In</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'account',
  computed: {
    user: function () {
      return this.$store.getters['auth/getUser']
    },
    photoBg: function () {
      return 'background-image: url(' + this.user.photoURL + ');'
    }
  },
  methods: {
    signout () {
      this.$store.dispatch('auth/signout')
      this.$router.push('authScreen')
    },
    signin () {
      this.$router.push('authScreen')
    }
  }
}
</script>

<style lang="scss" scoped>
#account {
  position: absolute;
  top: 1em;
  right: 1em;
}
button {
  margin: 0.4em auto 2em auto;
  display: block;
}
.avatar {
  display: block;
  background-size: cover;
  border-radius: 50%;
  width: 42px;
  height: 42px;
}
</style>
