import Vue from 'vue'
import Vuex from 'vuex'
import daylog from './daylog/'
import user from './user/'
import firebase from 'firebase'
import 'firebase/firestore'

Vue.use(Vuex)

firebase.initializeApp({
  apiKey: 'AIzaSyD_wojHsaAcldEJKATCuUQEUHnjByKFZtM',
  authDomain: 'agency-0900.firebaseapp.com',
  databaseURL: 'https://agency-0900.firebaseio.com',
  projectId: 'agency-0900',
  storageBucket: 'agency-0900.appspot.com',
  messagingSenderId: '1001967015491'
})
const settings = {timestampsInSnapshots: true}
firebase.firestore().settings(settings)

export default new Vuex.Store({
  state: {
    db: firebase.firestore(),
    fb: firebase
  },
  modules: {
    daylog,
    user
  }
})
