const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
  cover: { type: String, required: true, comment: '广告图片路径' },
  go_url: { type: String, alias: 'goUrl', comment: '跳转url' },
  title: { type: String, comment: '广告标题' },
  summary: { type: String, comment: '广告介绍' },
  index: { type: Number, comment: '排序' },
  created: { type: Number, default: Date.now, comment: '创建时间' }
})

Schema.methods = {
  /**
   * 格式化数据
   */
  format: function () {
    return {
      cover: this.cover,
      goUrl: this.go_url,
      title: this.title,
      summary: this.summary,
      index: this.index,
      created: this.created
    }
  }
}

module.exports = Schema
