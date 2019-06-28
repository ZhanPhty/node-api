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
    return err
  }
  return result
}

/**
 * 过滤html标签
 * 可用与提取富文本内容
 */
module.exports.filterHtml = str => {
  try {
    let res = str.replace(/<\/?[^>]*>/g, '')
    res = res.replace(/ /gi, '')

    return res
  } catch (err) {
    return err
  }
}
