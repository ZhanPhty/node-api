const mongoose = require('mongoose')
const paginate = require('mongoose-paginate-v2')

let Schema = new mongoose.Schema({
  title: { type: String, required: true, comment: '文章标题' },
  content: { type: String, required: true, comment: '文章内容' },
  summary: { type: String, default: '', comment: '文章简介' },
  type: { type: String, required: true, comment: '文章类型' },
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
  created: { type: Number, default: Date.now, comment: '文章创建时间' }
})

Schema.methods = {
  /**
   * 格式化数据
   * 返回给客户端的数据
   */
  formatArticle: function() {
    return {
      title: this.title,
      content: this.content,
      summary: this.summary,
      type: this.type,
      category: this.category,
      tags: this.tags,
      cover: this.cover,
      seo: this.seo,
      userInfo: this.user_info,
      read: this.read,
      praise: this.praise,
      review: this.review,
      last_revise: this.lastRevise,
      created: this.created
    }
  }
}

Schema.plugin(paginate)

module.exports = Schema
