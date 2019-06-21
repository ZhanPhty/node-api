module.exports = {
  common: {
    service: require('./common/service')
  },
  user: {
    login: require('./user/login'),
    reg: require('./user/reg')
  }
}
