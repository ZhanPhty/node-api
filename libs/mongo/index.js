module.exports = blog => {
  const model = {
    user: {
      User: blog.model('user', require('./user/user'))
    }
  }

  // 加载鉴别
  // model.user.User.loadDiscriminators();

  return model
}