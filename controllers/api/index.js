module.exports = {
  article: {
    article: require('./article/article'),
    action: require('./article/action')
  },
  common: {
    banner: require('./common/banner'),
    service: require('./common/service'),
    upload: require('./common/upload')
  },
  select: {
    select: require('./select/select')
  },
  user: {
    login: require('./user/login'),
    reg: require('./user/reg')
  }
}
