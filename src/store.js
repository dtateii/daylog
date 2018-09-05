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
    update: (state, log) => {
      // Instead of changing state directly, only change Firestore value,
      // as local state is listening (loadRecords) and will update anyway.
      let userId = 'bC2pZotbyhIBiPFmJ0DJ'
      let logId = '2018.08'
      let docRef = firebase.firestore().collection('users').doc(userId).collection('daylog').doc(logId)
      docRef.update({[log.key]: log.value})
    },
    init: (state, records) => {
      state.records = records
    }
  },
  actions: {
    updateEntry: (context, log) => {
      context.commit('update', log)
    },
    loadRecords: (context) => {
      let userId = 'bC2pZotbyhIBiPFmJ0DJ'
      let logId = '2018.08'
      let docRef = firebase.firestore().collection('users').doc(userId).collection('daylog').doc(logId)
      docRef.onSnapshot(function (doc) {
        // @todo: Possibly undesirable overwrite if records changing from multiple sources at once?
        context.commit('init', doc.data())
      })
    }
  },
  getters: {
    getRecords: (state) => {
      return state.records
    }
  }
})
