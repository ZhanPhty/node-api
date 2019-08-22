const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
  name: { type: String, required: true, comment: '博文分类' },
  count: { type: Number, default: 0, comment: '分类下的博文统计' }
})

Schema.methods = {
  /**
   * 格式化数据
   * 返回给客户端的数据
   */
  format: function () {
    return {
      name: this.name,
      count: this.count
    }
  }
}

// 静态方法
Schema.statics = {
  /**
   * 更新分类的统计数量
   * @param {String} category     需要更新的分类
   * @param {Number} count        统计总数
   */
  updateCount: async function (category, count) {
    let result = await this.updateOne({ name: category }, {
      $set: { count: count }
    }, { upsert: true })

    if (result) {
      return Promise.resolve(result)
    } else {
      return Promise.resolve(null)
    }
  }
}

module.exports = Schema
