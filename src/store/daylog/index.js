export default {
  namespaced: true,
  state: {
    logEntries: []
  },
  mutations: {
    init: (state, logEntries) => {
      state.logEntries = logEntries
    }
  },
  actions: {
    updateLogEntry: (context, logEntry) => {
      // Instead of changing state directly, only change Firestore value,
      // as local state is listening (loadlogEntries) and will update anyway.
      let user = context.rootState.auth.user
      if (!user.uid) {
        return
      }
      context.rootState.db.doc(`users/${user.uid}/daylog/${logEntry.id}`)
        .update({activity: logEntry.activity})
    },
    insertLogEntry: (context, logEntry) => {
      let user = context.rootState.auth.user
      if (!user.uid) {
        return
      }
      // Firebase automatically converts JS Date obj to Firbase Timestamp obj. Thanks!
      context.rootState.db.collection('users').doc(user.uid).collection('daylog')
        .add(logEntry).then(function () {
          console.log('Entry `' + logEntry.activity + '` successfully stored.')
        })
    },
    loadLogEntries: (context) => {
      let user = context.rootState.auth.user
      if (!user.uid) {
        return
      }
      context.rootState.db.collection(`users/${user.uid}/daylog`).orderBy('timestamp')
        .onSnapshot(function (querySnapshot) {
          let logEntries = []
          querySnapshot.forEach(function (doc) {
            let data = doc.data()
            // Need the id to come along so it can be used later to update this logEntry.
            data.id = doc.id
            logEntries.push(data)
          })
          logEntries.sort()
          context.commit('init', logEntries)
        })
    }
  },
  getters: {
    getLogEntries: (state) => {
      return state.logEntries
    }
  }
}
