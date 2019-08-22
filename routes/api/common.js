const router = require('koa-router')()
const api = require('../../controllers/api')

router.get('/service/captcha', api.common.service.captcha)
router.post('/upload', api.common.upload.upload)
router.get('/banner', api.common.banner.banner)

module.exports = router
