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
      let user = context.rootState.auth.user
      if (!user.uid) {
        return
      }
      context.rootState.db.doc(`users/${user.uid}/daylog/${logId}/entries/${entry.id}`)
        .update({activity: entry.activity})
    },
    insertEntry: (context, record) => {
      let user = context.rootState.auth.user
      if (!user.uid) {
        return
      }
      context.rootState.db.collection('users').doc(user.uid).collection('daylog').doc(logId).collection('entries')
        .add(record).then(function () {
          console.log('doc write')
        })
    },
    loadRecords: (context) => {
      let user = context.rootState.auth.user
      if (!user.uid) {
        return
      }
      context.rootState.db.collection(`users/${user.uid}/daylog/${logId}/entries`).orderBy('time')
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
