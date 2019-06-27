const { Code } = require('../../../libs/consts')

/**
 * 博客文章列表
 * @author 詹鹏辉
 * @create 2019-06-21 14:18:07
 */

exports.list = async (ctx, next) => {

  let errors = []
  if (ctx.errors) {
    errors = ctx.errors
    ctx.body = {
      code: Code.BadRequest.code,
      msg: Code.BadRequest.msg,
      errors
    }
    return
  }

  return ctx.body = {
    code: Code.BadRequest.code,
    msg: '账户或密码错误'
  }
}

/**
 * 发布文章 
 * @author 詹鹏辉
 * @create 2019-06-27 17:42:00
 * @param {String} title            文章标题
 * @param {String} content          内容
 * @param {Array} tags              文章标签
 * @param {String} type             文章类型
 * @param {String} category         博文分类
 * @param {Boolean} isPrivate       是否私密文章
 * @param {String} status           状态：草稿-'draft'、上线-'online', 默认'draft'
 * @param {Boolean} seo.title       seo的title
 * @param {Boolean} seo.keywords    seo的key
 * @param {Boolean} seo.description seo的desc
 */

exports.publish = async (ctx, next) => {
  ctx.checkBody('title').notEmpty('标题不能为空')
  ctx.checkBody('title').notEmpty('标题不能为空')
  ctx.checkBody('title').notEmpty('标题不能为空')
  ctx.checkBody('title').notEmpty('标题不能为空')

  let errors = []
  if (ctx.errors) {
    errors = ctx.errors
    ctx.body = {
      code: Code.BadRequest.code,
      msg: Code.BadRequest.msg,
      errors
    }
    return
  }

  return ctx.body = {
    code: Code.BadRequest.code,
    msg: '账户或密码错误'
  }
}
