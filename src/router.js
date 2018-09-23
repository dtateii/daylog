import Vue from 'vue'
import Router from 'vue-router'
import HomeScreen from './views/HomeScreen.vue'
import LogScreen from './views/LogScreen.vue'
import Auth from './views/Auth.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'homeScreen',
      component: HomeScreen
    },
    {
      path: '/auth',
      name: 'auth',
      component: Auth
    },
    {
      path: '/log/:year?/:month?',
      name: 'logScreen',
      component: LogScreen
    }
  ]
})
