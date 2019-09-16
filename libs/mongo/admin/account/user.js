const mongoose = require('mongoose')
const { User } = require('../../../consts')

let Schema = new mongoose.Schema(
  {
    account: { type: String, required: true, comment: '登录账号-主键' },
    password: { type: String, required: true, comment: '登录密码' },
    password_salt: { type: String, required: true, alias: 'passwordSalt', comment: '密码加密salt' },
    nick: { type: String, default: '管理员', comment: '昵称' },
    cover: { type: String, default: '', comment: '头像路径' },
    type: { type: String, comment: '账号类型' },
    status: { type: String, default: 'normal', enum: Object.keys(User.status), comment: '状号状态' },
    is_root: { type: Boolean, alias: 'isRoot', default: false, comment: '是否超级管理员' },
    last_login: { type: Number, alias: 'lastLogin', comment: '最后登录时间' },
    created: { type: Number, default: Date.now, comment: '账号创建时间' }
  },
  { discriminatorKey: 'admin' }
)

Schema.methods = {
  /**
   * 格式化数据
   * 返回给客户端的数据
   */
  format: function () {
    return {
      id: this._id,
      account: this.account,
      status: this.status,
      nick: this.nick,
      created: this.created,
      cover: this.cover,
      isRoot: this.is_root,
      lastLogin: this.last_login
    }
  }
}

module.exports = Schema
