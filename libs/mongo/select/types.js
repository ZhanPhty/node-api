const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
  name: { type: String, required: true, comment: '文章分类名称' },
  identify: { type: String, required: true, comment: '文章分类标识' }
})

Schema.methods = {
  /**
   * 格式化数据
   * 返回给客户端的数据
   */
  format: function() {
    return {
      name: this.name,
      identify: this.identify
    }
  }
}

module.exports = Schema
