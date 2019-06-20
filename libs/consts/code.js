module.exports = {
  OK: {
    code: 200,
    msg: '操作成功'
  },
  Created: {
    code: 201,
    msg: '重复操作'
  },
  Moved: {
    code: 301,
    msg: '己重定向'
  },
  Move: {
    code: 302,
    msg: '己重定向'
  },
  BadRequest: {
    code: 400,
    msg: '参数错误',
    opMsg: '操作失败$',
  },
  Unauthorized: {
    code: 401,
    msg: '未认证、认证失败'
  },
  AuthorizationExpired: {
    code: 402,
    msg: '未授权、授权过期'
  },
  Forbidden: {
    code: 403,
    msg: '禁止访问、操作权限不足'
  },
  NotFound: {
    code: 404,
    msg: '未找到'
  },
  InternalServerError: {
    code: 500,
    msg: '服务器内部错误'
  },
  GatewayTimeout: {
    code: 504,
    msg: '请求超时'
  },
}
