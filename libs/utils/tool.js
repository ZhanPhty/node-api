const crypto = require('crypto')

/**
 * 密码加密
 */
module.exports.md5 = str => {
  let result = ''
  try {
    if (str && typeof str === 'string') {
      var md5Str = crypto.createHash('md5')
      result = md5Str.update(str).digest('hex')
    } else {
      result = ''
    }
  } catch (err) {
    return result
  }
  return result
}
