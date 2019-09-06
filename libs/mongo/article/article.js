const mongoose = require('mongoose')
const paginate = require('mongoose-paginate-v2')

let Schema = new mongoose.Schema({
  title: { type: String, required: true, comment: '文章标题' },
  content: { type: String, required: true, comment: '文章内容' },
  summary: { type: String, default: '', comment: '文章简介' },
  type: { type: String, required: true, comment: '文章类型' },
  type_url: { type: String, alias: 'typeUrl', comment: '转载url' },
  category: { type: String, required: true, comment: '博文分类' },
  tags: { type: Array, default: [], comment: '文章标签' },
  cover: { type: String, comment: '文章封面' },
  is_private: { type: Boolean, default: false, alias: 'isPrivate', comment: '是否私密文章' },
  status: { type: String, default: 'draft', comment: '文章状态' },
  seo: {
    title: { type: String, comment: '页面的title' },
    keywords: { type: String, comment: '页面的keywords' },
    description: { type: String, comment: '页面的description' }
  },
  user_info: {
    id: { type: String, required: true, comment: '用户id' },
    nick: { type: String, comment: '用户昵称' },
    cover: { type: String, comment: '用户头像' },
    type: { type: String, comment: '账号类型' },
    is_root: { type: Boolean, alias: 'isRoot', comment: '是否管理员' }
  },
  read: { type: Number, default: 0, comment: '阅读量' },
  praise: { type: Number, default: 0, comment: '点赞量' },
  review: { type: Number, default: 0, comment: '评论量' },
  last_revise: { type: Number, alias: 'lastRevise', comment: '最后修改时间' },
  created: { type: Number, default: Date.now, comment: '文章创建时间' },
  delete_at: { type: Number, alias: 'deleteAt', comment: '文章软删除时间' },
  toped: { type: Boolean, default: false, comment: '置顶文章' },
  hotted: { type: Boolean, default: false, comment: '热门文章' },
  weight: { type: Number, default: 0, comment: '文章权重' },
  ip: { type: String, comment: 'ip' }
})

Schema.methods = {
  /**
   * 格式化数据
   * 返回给客户端的数据
   */
  formatArticle: function() {
    return {
      id: this._id,
      title: this.title,
      isPrivate: this.is_private,
      content: this.content,
      summary: this.summary,
      type: this.type,
      typeUrl: this.type_url,
      category: this.category,
      tags: this.tags,
      cover: this.cover,
      seo: this.seo,
      userInfo: this.user_info,
      read: this.read,
      praise: this.praise,
      isPraise: this.isPraise,
      review: this.review,
      lastRevise: this.last_revise,
      created: this.created,
      hotted: this.hotted,
      status: this.status
    }
  }
}

// 静态方法
Schema.statics = {
  /**
   * 查询分类博文的数量
   * @param {String} category     需查询的分类
   */
  findCategory: async function(category) {
    let count = await this.countDocuments({ category, status: 'online', is_private: false })

    return Promise.resolve(count)
  },

  /**
   * 更新文档，自增或自减
   * 添加阅读量、更新点赞数、更新评论数
   * @param {String} key         要更新的字段
   * @param {String} aid         文章id
   */
  updateIncDoc: function(key, aid, num = 1) {
    this.findOneAndUpdate({ _id: aid }, { $inc: { [key]: num } }, { useFindAndModify: false }, () => {})
  },

  /**
   * 更新权重
   * 评论、阅读、点赞都可增加权重
   * ========================================
   * Score = (P + (R / 100) + (L * 2)) / (T+2)^G
   * P = 评价的数量
   * R = 文章阅读数( 除于100，降低阅读的权重 )
   * L = 文章点赞数( 乘于3，提高点赞的权重 )
   * T = 从文章提交至今的时间(小时)
   * G = 比重，缺省值是1.8，G值越大，排名下降得越快
   * ========================================
   * @param {String} aid         文章id
   */
  updateWeight: async function(aid) {
    const { review, read, praise, created } = await this.findOne({ _id: aid }).exec()
    const currentDate = (Date.now() - created) / 1000 / 60 / 60 // 小时
    const gravity = currentDate > 720 ? 2 : 1.5 // 超过720小时比重提升到2.0
    let score = (review + read / 100 + praise * 2) / Math.pow(currentDate + 2, gravity)

    this.updateOne(
      { _id: aid },
      {
        $set: { weight: score }
      },
      { upsert: true },
      () => {}
    )
  },

  /**
   * 更新分类的统计数量
   * @param {String} key          要更新的字段
   * @param {String} aid          文章id
   * @param {Number} count        统计总数
   */
  updateCount: async function(key, aid, count) {
    let result = await this.updateOne(
      { _id: aid },
      {
        $set: { [key]: count }
      },
      { upsert: true }
    )

    if (result) {
      return Promise.resolve(result)
    } else {
      return Promise.resolve(null)
    }
  }
}

Schema.plugin(paginate)

module.exports = Schema
