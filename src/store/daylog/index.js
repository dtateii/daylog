import TimeHelper from '@/common/timeHelper'

export default {
  namespaced: true,
  state: {
    logEntries: [],
    logDays: [],
    month: null,
    year: null
  },
  mutations: {
    setEntries: (state, logEntries) => {
      state.logEntries = logEntries
    },
    setDays: (state, days) => {
      state.logDays = days
    },
    selectLog: (state, set) => {
      state.year = parseInt(set.year)
      state.month = parseInt(set.month)
    }
  },
  actions: {
    selectLog: (context, set) => {
      context.commit('selectLog', set)
    },
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
    deleteLogEntry: (context, entryId) => {
      let user = context.rootState.auth.user
      if (!user.uid) {
        return
      }
      context.rootState.db.doc(`users/${user.uid}/daylog/${entryId}`).delete().then(function () {
        console.log('Document ' + entryId + ' successfully deleted')
      }).catch(function (error) {
        console.error('Error removing document: ', error)
      })
    },
    insertLogEntry: (context, logEntry) => {
      let user = context.rootState.auth.user
      if (!user.uid) {
        return
      }
      // Firebase automatically converts JS Date obj to Firbase Timestamp obj. Thanks!
      return new Promise((resolve, reject) => {
        context.rootState.db.collection('users').doc(user.uid).collection('daylog')
          .add(logEntry).then(function () {
            console.log('Entry `' + logEntry.activity + '` successfully stored.')
            resolve()
          })
      })
    },
    loadLogEntries: (context) => {
      let user = context.rootState.auth.user
      if (!user.uid) {
        return
      }
      const rangeStart = new Date(context.state.year + ':' + context.state.month)
      const rangeEnd = new Date(context.state.year + ':' + (context.state.month + 1))
      context.rootState.db.collection(`users/${user.uid}/daylog`)
        .where('timestamp', '>=', rangeStart)
        .where('timestamp', '<', rangeEnd)
        .orderBy('timestamp')
        .onSnapshot(function (querySnapshot) {
          let logEntries = []
          querySnapshot.forEach(function (doc) {
            let data = doc.data()
            // Need the id to come along so it can be used later to update this logEntry.
            data.id = doc.id
            logEntries.push(data)
          })
          context.commit('setEntries', logEntries)
        })
    },
    loadLogDays: (context) => {
      // Construct the calendar of days for this month log set.
      let days = []
      // Calculate the number of days in the logset month:
      let daysInMonth = TimeHelper.daysInMonth(context.state.year, context.state.month)
      let lastDay = daysInMonth
      // If the month in set is the current calendar month, then extend
      // the days list only to the current day.
      if (context.state.month === TimeHelper.getNow().month.num) {
        // Today's day number is the limit to which the set should extend.
        lastDay = TimeHelper.getNow().day.num
      }

      // Series of non-workdays (usually weekends) are "offdays" and
      // group together for minimized, unified presentation.
      let offdaySeries = []
      // Begin weekday enumeration from first day in the set month.
      let weekdayNum = new Date(context.state.year + ':' + context.state.month).getDay()

      // Loop: Build out each day's properties
      for (let i = 0; i < lastDay; i++) {
        // All days are considered either "workdays" or "offdays".
        // Default "workdays" are M-F, "offdays" are Sa-Su, derived
        // from the weekday number.
        days[i] = {
          date: new Date(context.state.year + '/' + context.state.month + '/' + (i + 1)),
          name: TimeHelper.getWeekdayName(weekdayNum),
          isToday: (context.state.month === TimeHelper.getNow().month.num) && i === (TimeHelper.getNow().day.num - 1),
          isWorkday: (weekdayNum > 0 && weekdayNum < 6)
        }

        // Handle offday series (aka weekends) grouping.
        // Initially assume every non-workday will be the last one in a series.
        days[i].isLastOffday = true

        // Consecutive non-workdays are grouped together for different display.
        if (days[i].isWorkday) {
          // Any occurrence of a workday should reset the current series of offdays.
          offdaySeries = []
        } else {
          // Add this offday to the current unbroken series of offdays.
          // The series only needs the names of the days in it.
          offdaySeries.push({
            name: days[i].name,
            dayNum: i + 1
          })
          // Each consecutive non-workday should unmake the previous assumption
          // such that a string of non-work days flags only the last one as 'last'.
          let previous = i - 1
          if (previous >= 0) {
            if (!days[previous].isWorkday) {
              days[previous].isLastOffday = false
              // Likewise, remove the unnecessary series attachment.
              delete days[previous].offdaySeries
            }
          }
          // Attach the current series to this offday.
          days[i].offdaySeries = offdaySeries
        }

        // Increment the weekday number.
        weekdayNum === 6 ? weekdayNum = 0 : weekdayNum++
      }
      context.commit('setDays', days)
    }
  },
  getters: {
    getLogEntries: (state) => {
      return state.logEntries
    },
    getLogDays: (state) => {
      return state.logDays
    }
  }
}
