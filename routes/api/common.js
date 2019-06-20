const router = require('koa-router')()
const api = require('../../controllers/api')

router.get('/service/captcha', api.common.service.captcha)

module.exports = router
