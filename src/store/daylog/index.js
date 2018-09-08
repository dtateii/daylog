const userId = 'bC2pZotbyhIBiPFmJ0DJ'
const logId = '2018.08'

export default {
  namespaced: true,
  state: {
    records: []
  },
  mutations: {
    init: (state, records) => {
      state.records = records
    }
  },
  actions: {
    updateEntry: (context, log) => {
      // Instead of changing state directly, only change Firestore value,
      // as local state is listening (loadRecords) and will update anyway.
      let docRef = context.rootState.db.collection('users').doc(userId).collection('daylog').doc(logId)
      docRef.update({[log.key]: log.value})
    },
    insertEntry: (context, record) => {
      context.rootState.db.collection('users').doc(userId).collection('daylog').doc(logId)
        .update(record).then(function () {
          console.log('doc write')
        })
    },
    loadRecords: (context) => {
      let docRef = context.rootState.db.collection('users').doc(userId).collection('daylog').doc(logId)
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
}
