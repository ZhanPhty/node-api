const mongoose = require('mongoose')
const { User } = require('../../consts')
const { tool } = require('../../utils')

let Schema = new mongoose.Schema(
  {
    account: { type: String, required: true, comment: '登录账号-主键' },
    password: { type: String, required: true, comment: '登录密码' },
    password_salt: { type: String, required: true, alias: 'passwordSalt', comment: '密码加密salt' },
    email: { type: String, required: true, comment: '邮箱' },
    email_verified: { type: Boolean, default: false, alias: 'emailVerified', comment: '邮箱验证状态' },
    nick: { type: String, default: '', comment: '昵称' },
    level: { type: Number, default: 0, comment: '用户级别' },
    summary: { type: String, default: '', comment: '用户简介' },
    cover: { type: String, default: '', comment: '头像路径' },
    phone: { type: String, default: '', comment: '手机号' },
    birthday: { type: String, comment: '生日' },
    province: { type: String, comment: '省' },
    city: { type: String, comment: '市' },
    district: { type: String, comment: '区' },
    address: { type: String, comment: '详细地址' },
    web: { type: String, default: '', comment: '网址主页' },
    type: { type: String, comment: '账号类型' },
    status: { type: String, default: 'pending', enum: Object.keys(User.status), comment: '状号状态' },
    checked: { type: Number, comment: '审核时间' },
    desc: { type: String, comment: '审核备注' },
    is_root: { type: Boolean, alias: 'isRoot', default: false, comment: '是否管理员账号' },
    last_login: { type: Number, alias: 'lastLogin', comment: '最后登录时间' },
    created: { type: Number, default: Date.now, comment: '账号创建时间' }
  },
  { discriminatorKey: 'kind' }
)

// 实例方法
Schema.methods = {
  /**
   * 格式化数据
   * 返回给客户端的数据
   */
  formatClient: function() {
    return {
      account: this.account,
      email: this.email,
      emailVerified: this.email_verified,
      status: this.status,
      nick: this.nick,
      created: this.created,
      type: this.type,
      level: this.level
    }
  }
}

// 静态方法
Schema.statics = {
  /**
   * 登录
   * 验证登录账户、密码
   * 密码使用'pass+salt'的md5加密获得
   */
  login: async function(account, password) {
    let result = await this.findOne({ account }).exec()

    if (result && result.password === tool.md5(`${password}${result.password_salt}`)) {
      return Promise.resolve(result)
    } else {
      return Promise.resolve(null)
    }
  }
}

module.exports = Schema
