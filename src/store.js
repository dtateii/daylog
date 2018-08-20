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
    db: firebase.firestore()
  },
  mutations: {
    insert: (state, record) => {
      const userId = 'bC2pZotbyhIBiPFmJ0DJ'
      const logId = '2018.08'
      state.db.collection('users').doc(userId).collection('daylog').doc(logId)
        .set(record).then(function () {
          console.log('Document successfully written!')
        })
    }
  },
  actions: {
    getLog: (state, logId) => {
      const userId = 'bC2pZotbyhIBiPFmJ0DJ'
      logId = '2018.08'
      let docRef = state.db.collection('users').doc(userId).collection('daylog').doc(logId)
      docRef.get().then(function (doc) {
        if (doc.exists) {
          console.log(doc.data())
          return doc.data()
        } else {
          console.log('No document')
        }
      }).catch(function (error) {
        console.log('Error getting doc:', error)
      })
    }
  },
  getters: {
    records: actions => {
      return function () {
      }
    }
  }
})
