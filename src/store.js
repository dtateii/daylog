import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
import 'firebase/firestore'

firebase.initializeApp(
  {
    apiKey: 'AIzaSyD_wojHsaAcldEJKATCuUQEUHnjByKFZtM',
    authDomain: 'agency-0900.firebaseapp.com',
    databaseURL: 'https://agency-0900.firebaseio.com',
    projectId: 'agency-0900',
    storageBucket: 'agency-0900.appspot.com',
    messagingSenderId: '1001967015491'
  }
)

const settings = {timestampsInSnapshots: true}
firebase.firestore().settings(settings)

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    records: []
  },
  mutations: {
    insert: (state, record) => {
      const userId = 'bC2pZotbyhIBiPFmJ0DJ'
      const logId = '2018.08'
      firebase.firestore().collection('users').doc(userId).collection('daylog').doc(logId)
        .update(record).then(function () {
          console.log('Document successfully written')
        })
    },
    init: (state, records) => {
      state.records = records
    }
  },
  actions: {
    loadRecords: (context) => {
      let userId = 'bC2pZotbyhIBiPFmJ0DJ'
      let logId = '2018.08'
      let docRef = firebase.firestore().collection('users').doc(userId).collection('daylog').doc(logId)
      docRef.get().then(function (doc) {
        if (doc.exists) {
          context.commit('init', doc.data())
        } else {
          console.log('No document')
        }
      }).catch(function (error) {
        console.log('Error getting doc:', error)
      })
    }
  },
  getters: {
    getRecords: (state) => {
      return state.records
    }
  }
})
