const router = require('koa-router')()
const api = require('../../controllers/api')

router.get('/service/captcha', api.common.service.captcha)
router.post('/service/renewal', api.common.service.renewal)

module.exports = router
