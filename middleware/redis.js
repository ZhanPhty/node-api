const Redis = require('ioredis')

module.exports = options => {
  // 构造一个Redis实例，并挂到 ctx 上
  let client = new Redis(options)

  client.on('error', e => {
    console.error('error:' + e)
  })
  client.on('close', e => {
    console.log('close:' + e)
  })

  return async (ctx, next) => {
    ctx.redis = client
    await next()
  }
}
