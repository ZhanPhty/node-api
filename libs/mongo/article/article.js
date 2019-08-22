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
  weight: { type: Number, default: 0, comment: '文章权重' }
})

Schema.methods = {
  /**
   * 格式化数据
   * 返回给客户端的数据
   */
  formatArticle: function () {
    return {
      id: this._id,
      title: this.title,
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
      review: this.review,
      lastRevise: this.last_revise,
      created: this.created,
      hotted: this.hotted
    }
  }
}

// 静态方法
Schema.statics = {
  /**
   * 查询分类博文的数量
   * @param {String} category     需查询的分类
   */
  findCategory: async function (category) {
    let count = await this.countDocuments({ category })

    if (count) {
      return Promise.resolve(count)
    } else {
      return Promise.resolve(null)
    }
  },

  /**
   * 更新权重
   * 阅读、评论、点赞、设置置顶、设置热门、都可增加权重
   */
  updateWeight: async function (account, password) {
    let result = await this.findOne({ account }).exec()

    if (result && result.password === tool.md5(`${password}${result.password_salt}`)) {
      return Promise.resolve(result)
    } else {
      return Promise.resolve(null)
    }
  }
}

Schema.plugin(paginate)

module.exports = Schema
