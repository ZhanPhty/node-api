// const { Code, Paginate } = require('../../../libs/consts')

// /**
//  * 管理员 - 获取文章列表
//  * @author 詹鹏辉
//  * @create 2019-06-28 17:31:59
//  * @param {Number} page           分页
//  * @param {Number} pageSize       页码
//  */
// exports.list = async (ctx, next) => {
//   const page = ctx.query.page ? parseInt(ctx.query.page) : 1
//   const limit = ctx.query.pageSize ? parseInt(ctx.query.pageSize) : config.get('limit')
//   const category = ctx.query.category

//   let errors = []
//   if (ctx.errors) {
//     errors = ctx.errors
//     ctx.body = {
//       code: Code.BadRequest.code,
//       msg: Code.BadRequest.msg,
//       errors
//     }
//     return
//   }

//   let paginateQuery = { status: 'online', is_private: false }
//   if (category && category !== '') paginateQuery.category = category
//   await ctx.mongo.article.Article.paginate(
//     paginateQuery,
//     {
//       select: '-is_private -status -content -delete_at',
//       sort: { created: -1 },
//       page,
//       limit,
//       customLabels: Paginate
//     },
//     (err, res) => {
//       if (err) {
//         ctx.body = {
//           code: Code.BadRequest.code,
//           msg: Code.BadRequest.msg,
//           errors
//         }
//       } else {
//         ctx.body = {
//           code: Code.OK.code,
//           msg: Code.OK.msg,
//           data: res
//         }
//       }
//     }
//   )
// }
