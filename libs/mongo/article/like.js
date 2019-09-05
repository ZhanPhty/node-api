const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
  article_id: { type: String, alias: 'articleId', required: true, comment: '文章id' },
  user_id: { type: String, alias: 'userId', required: true, comment: '用户id' },
  created: { type: Number, default: Date.now, comment: '点赞创建时间' },
  ip: { type: String, comment: 'ip' }
})

Schema.methods = {
  /**
   * 格式化数据
   * 返回给客户端的数据
   */
  format: function () {
    return {
      articleId: this.article_id,
      userId: this.user_id,
      created: this.created
    }
  }
}

// 静态方法
Schema.statics = {
  /**
   * 查询点赞的数量
   * @param {String} aid        文章id
   */
  findLikeDoc: async function (aid) {
    let count = await this.countDocuments({ article_id: aid })

    return Promise.resolve(count)
  }
}

module.exports = Schema
