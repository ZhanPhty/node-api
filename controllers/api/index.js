module.exports = {
  article: {
    article: require('./article/article')
  },
  common: {
    service: require('./common/service'),
    upload: require('./common/upload')
  },
  user: {
    login: require('./user/login'),
    reg: require('./user/reg')
  }
}
