const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
  name: { type: String, required: true, comment: '文章标签' }
})

Schema.methods = {
  /**
   * 格式化数据
   * 返回给客户端的数据
   */
  format: function () {
    return this.name
  }
}

module.exports = Schema
