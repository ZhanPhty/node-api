const router = require('koa-router')()
const api = require('../../controllers/api')

router.get('/service/captcha', api.public.service.captcha)

module.exports = router