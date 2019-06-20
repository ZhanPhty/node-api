const crypto = require('crypto')

exports.md5 = str => {
  var result = ''
  try {
    if (str && typeof str === "string") {
      var md5Str = crypto.createHash('md5')
      result = md5Str.update(str).digest('hex')
    }
    else {
      result = ''
    }
  } catch (err) {
    return result
  }
  return result
}

