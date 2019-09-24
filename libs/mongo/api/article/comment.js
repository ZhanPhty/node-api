const mongoose = require('mongoose')
const paginate = require('mongoose-paginate-v2')

let Schema = new mongoose.Schema({
  article_id: { type: String, alias: 'articleId', required: true, comment: '文章id' },
  target_id: { type: String, alias: 'targetId', comment: '被回复评论的id' },
  author: { type: Boolean, default: false, comment: '是否作者' },
  user_id: { type: String, alias: 'userId', required: true, comment: '用户id' },
  nick: { type: String, comment: '用户昵称' },
  cover: { type: String, default: '', comment: '头像路径' },
  level: { type: Number, default: 0, comment: '用户级别' },
  type: { type: String, comment: '账号类型' },
  is_root: { type: Boolean, alias: 'isRoot', default: false, comment: '是否管理员账号' },
  parent_id: { type: String, alias: 'parentId', comment: '被回复人id' },
  parent_nick: { type: String, default: '', alias: 'parentNick', comment: '被回复人昵称' },
  parent_author: { type: Boolean, default: false, alias: 'parentAuthor', comment: '被回复人是否作者' },
  content: { type: String, comment: '回复内容' },
  status: { type: String, comment: '评论类型状态' },
  created: { type: Number, default: Date.now, comment: '点赞创建时间' },
  ip: { type: String, comment: 'ip' }
})

Schema.methods = {
  /**
   * 格式化数据
   * 返回给客户端的数据
   */
  format: function() {
    return formatComment(this)
  }
}

// 静态方法
Schema.statics = {
  /**
   * 查询评论的数量
   * @param {String} aid        文章id
   */
  findCommentDoc: async function(aid) {
    let count = await this.countDocuments({ article_id: aid })

    return Promise.resolve(count)
  },

  /**
   * 根据文章id查询对应的评论
   * @param {String} aid        文章id
   */
  findComments: async function(aid) {
    const result = await this.find({ article_id: aid })
      .select('-article_id -__v')
      .sort('created')
      .exec()

    if (result) {
      let resData = [],
        subData = []
      let nodeList = result.filter(item => item.status === '1')
      let subList = result.filter(item => item.status === '0')

      // 格式化数据
      subList.map(item => {
        subData.push({
          ...formatComment(item)
        })
      })

      // 获得最后的数据
      nodeList.map(item => {
        resData.push({
          ...formatComment(item),
          sub: subData.filter(f => f.targetId === item.id)
        })
      })

      return Promise.resolve(resData)
    } else {
      return Promise.resolve(null)
    }
  }
}

function formatComment(source) {
  return {
    id: source._id,
    targetId: source.target_id,
    userId: source.user_id,
    nick: source.nick,
    author: source.author,
    cover: source.cover,
    level: source.level,
    type: source.type,
    isRoot: source.is_root,
    parentId: source.parent_id,
    parentNick: source.parent_nick,
    parentAuthor: source.parent_author,
    content: source.content,
    status: source.status,
    created: source.created,
    ip: source.ip
  }
}

Schema.plugin(paginate)

module.exports = Schema
