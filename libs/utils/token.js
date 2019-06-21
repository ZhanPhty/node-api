const jwt = require('jsonwebtoken')

/**
 * 加密token
 * 保存用户id, 使用key, 默认过期时间为1d
 * @param  {String} uid 	      用户标识或其它要加密码的标识
 * @param  {String} secretKey   加密用的key
 * @param  {String} options  	  配置，可设置过期时间等
 * @return {String} token
 */
module.exports.createToken = (uid, secretKey, options = {}) => {
  return new Promise((resolve, reject) => {
    const token = jwt.sign({ uid }, secretKey, {
      expiresIn: '1d',
      ...options
    })
    resolve(token)
    reject(null)
  })
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
  return new Promise((resolve, reject) => {
    const decoded = jwt.verify(token, secretKey)
    resolve(decoded)
    reject(null)
  })
}
