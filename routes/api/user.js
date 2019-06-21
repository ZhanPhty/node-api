const router = require('koa-router')()
const api = require('../../controllers/api')

router.get('/reg/check/account', api.user.reg.checkUsername)
router.post('/reg', api.common.service.checkCaptcha, api.user.reg.register)
router.post('/login', api.user.login.login)

module.exports = router
