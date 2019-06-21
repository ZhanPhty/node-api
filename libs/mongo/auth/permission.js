const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
  name: { type: String, required: true, comment: '使用者名称-主键' },
  desc: { type: String, default: '', comment: '备注' },
  auth_key: { type: String, required: true, alias: 'authKey', comment: '授权key' },
  auth_secret: { type: String, required: true, alias: 'authSecret', comment: '授权secret' },
  type: { type: String, required: true, comment: '标识' },
  update: { type: Number, comment: '更新时间' },
  created: { type: Number, default: Date.now, comment: '创建时间' }
})

// 实例方法
Schema.methods = {
  /**
   * 格式化数据
   * 返回给客户端的数据
   */
  formatClient: function() {
    return {
      name: this.name,
      desc: this.desc,
      authKey: this.auth_key,
      authSecret: this.auth_secret,
      update: this.update,
      type: this.type,
      created: this.created
    }
  }
}

module.exports = Schema
