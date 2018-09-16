module.exports = {
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
  }
}
