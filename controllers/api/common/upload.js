const { Code } = require('../../../libs/consts')
const qiniu = require('qiniu')

/**
 * 上传文件至七牛云
 */
function uploadToQiniu(path, key) {
  // 七牛云配置
  const configQiniu = config.get('qiniu')
  // 生成上传凭证
  const mac = new qiniu.auth.digest.Mac(configQiniu.accessKey, configQiniu.secretKey)
  // 设置七牛的上传空间
  const putPolicy = new qiniu.rs.PutPolicy({
    scope: configQiniu.bucket
  })
  //生成上传的Token
  const uploadToken = putPolicy.uploadToken(mac)
  //实例化config
  const configOpt = new qiniu.conf.Config()
  // 空间对应的机房, Zone_z2(华南)
  configOpt.zone = qiniu.zone.Zone_z2
  // 初始化七牛云
  const formUploader = new qiniu.form_up.FormUploader(configOpt)
  const putExtra = new qiniu.form_up.PutExtra()

  return new Promise((resolved, reject) => {
    formUploader.putFile(uploadToken, key, path, putExtra, (respErr, respBody) => {
      if (respErr) {
        reject(respErr)
      } else {
        resolved({
          ...respBody,
          url: `${configQiniu.baseUrl}/${respBody.key}`
        })
      }
    })
  })
}

/**
 * 上传文件
 * @param {Number} dir           文件路径(比如'/'结尾)
 */
module.exports.upload = async (ctx, next) => {
  const dir = ctx.request.body.dir || 'image/'

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

  const { file: { path, name, size, type } } = ctx.request.files
  // 文件名-时间戳 作为上传文件key
  let pos = name.lastIndexOf('.')
  let suffix = ''
  if (pos !== -1) {
    suffix = name.substring(pos)
  }
  const fullName = `${name.substring(0, pos)}-${new Date().getTime()}${suffix}`
  const result = await uploadToQiniu(path, `${dir}${fullName}`)

  if (result) {
    ctx.body = {
      code: Code.OK.code,
      msg: Code.OK.msg,
      data: {
        ...result,
        name,
        fullName,
        size,
        type
      }
    }
  } else {
    ctx.body = {
      code: Code.BadRequest.code,
      msg: '图片上传出错'
    }
  }
}
