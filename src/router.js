import Vue from 'vue'
import Router from 'vue-router'
import HomeScreen from './views/HomeScreen.vue'
import LogScreen from './views/LogScreen.vue'
import AuthScreen from './views/AuthScreen.vue'
import Store from './store'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'homeScreen',
      component: HomeScreen,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/auth',
      name: 'authScreen',
      component: AuthScreen
    },
    {
      path: '/log/:year?/:month?',
      name: 'logScreen',
      component: LogScreen,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

// Navigation Guards:
// Check the user state in the store. This should give
// ideal performance for normal use aside from hard
// refresh or initial load. If no user _when one was
// expected_, then redirect to auth endpoint, which
// will then redirect back to intended target after auth
// is successful. Note this isn't securing anything just
// managing the experience.
router.beforeEach((to, from, next) => {
  // Try the store for currently loaded user.
  let user = Store.getters['auth/getUser']

  if (user === null && to.meta.requiresAuth) {
    // router: user is null but auth is required. goto auth
    next({
      name: 'authScreen',
      query: { goto: to.fullPath }
    })
  } else if (user !== null && to.name === 'authScreen') {
    // router: user is authed, no reason to load auth page
    if (to.query.goto == null) {
      next({name: 'homeScreen'})
    } else {
      next(to.query.goto)
    }
  } else {
    next()
  }
})

export default router
