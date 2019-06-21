module.exports = (blog, admin) => {
  const model = {
    auth: {
      Permission: admin.model('permission', require('./auth/permission'))
    },
    user: {
      User: blog.model('user', require('./user/user'))
    }
  }

  // 加载鉴别
  // model.user.User.loadDiscriminators();

  return model
}
