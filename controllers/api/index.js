module.exports = {
  article: {
    article: require('./article/article')
  },
  common: {
    service: require('./common/service')
  },
  user: {
    login: require('./user/login'),
    reg: require('./user/reg')
  }
}
