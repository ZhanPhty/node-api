const jwt = require('jsonwebtoken')

/**
 * 加密token
 * 加密信息保存用户id
 * 生成一个登录状态token
 * @param  {String} uid 	      用户标识或其它要加密码的标识
 * @param  {String} secretKey   加密用的key
 * @param  {String} options  	  配置，可设置过期时间等
 * @return {Object} { token }
 */
module.exports.createToken = (uid, secretKey, options = {}) => {
  try {
    const token = jwt.sign({ uid }, secretKey, {
      expiresIn: '7d',
      ...options
    })

    return { token }
  } catch (err) {
    return err
  }
}

/**
 * 解析token
 * 保存用户id, 使用key, 默认过期时间为1d
 * @param  {String} token 	      用户标识或其它要加密码的标识
 * @param  {String} secretKey   加密用的key
 * @param  {String} options  	  配置，可设置过期时间等
 * @return {String} token
 */
module.exports.checkToken = (token, secretKey, options = {}) => {
  try {
    return jwt.verify(token, secretKey, options)
  } catch (err) {
    return err
  }
}
