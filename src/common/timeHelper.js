export default {
  // todo: can this be offered as an extension of Date.toLocaleString?
  getWeekdayName: (weekdayNum) => {
    let name = ''
    switch (weekdayNum) {
      case 0:
        name = 'Sun Day'
        break
      case 1:
        name = 'Moon Day'
        break
      case 2:
        name = 'Tuis Day'
        break
      case 3:
        name = 'Odens Day'
        break
      case 4:
        name = 'Thors Day'
        break
      case 5:
        name = 'Friggas Day'
        break
      case 6:
        name = 'Saturns Day'
        break
    }
    return name
  },
  getNow: function () {
    let date = new Date()
    return {
      year: parseInt(date.toLocaleString('en-US', {year: 'numeric'})),
      month: {
        name: date.toLocaleString('en-US', {month: 'long'}),
        num: parseInt(date.toLocaleString('en-US', {month: 'numeric'}))
      },
      day: {
        name: this.getWeekdayName(date.getDay()),
        num: parseInt(date.toLocaleString('en-US', {day: 'numeric'}))
      }
    }
  },
  daysInMonth: (year, monthNum) => {
    // https://www.bennadel.com/blog/3311-using-the-joyous-power-of-relative-dates-to-calculate-days-in-month-in-javascript.htm
    return new Date(year, (monthNum), 0).getDate()
  }
}
