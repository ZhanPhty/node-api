const mongoose = require('mongoose')
const paginate = require('mongoose-paginate-v2')

let Schema = new mongoose.Schema({
  name: { type: String, required: true, comment: '文章标签' }
})

Schema.methods = {
  /**
   * 格式化数据
   * 返回给客户端的数据
   */
  format: function() {
    return this.name
  }
}

Schema.plugin(paginate)

module.exports = Schema
