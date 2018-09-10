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
    updateEntry: (context, entry) => {
      // Instead of changing state directly, only change Firestore value,
      // as local state is listening (loadRecords) and will update anyway.
      context.rootState.db.collection('users').doc(userId).collection('daylog').doc(logId).collection('entries').doc(entry.id)
        .update({activity: entry.activity})
    },
    insertEntry: (context, record) => {
      context.rootState.db.collection('users').doc(userId).collection('daylog').doc(logId).collection('entries')
        .add(record).then(function () {
          console.log('doc write')
        })
    },
    loadRecords: (context) => {
      context.rootState.db.collection('users').doc(userId).collection('daylog').doc(logId).collection('entries').orderBy('time')
        .onSnapshot(function (querySnapshot) {
          let records = []
          querySnapshot.forEach(function (doc) {
            let data = doc.data()
            // Need the id to come along so it can be used later to update this record.
            data.id = doc.id
            records.push(data)
          })
          records.sort()
          context.commit('init', records)
        })
    }
  },
  getters: {
    getRecords: (state) => {
      return state.records
    }
  }
}
