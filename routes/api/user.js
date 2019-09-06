const router = require('koa-router')()
const api = require('../../controllers/api')

router.get('/reg/check/account', api.user.reg.checkUsername)
router.post('/reg', api.common.service.checkCaptcha, api.user.reg.register)
router.post('/login', api.common.service.checkCaptcha, api.user.login.login)
router.get('/user/center', api.user.center.info)
router.put('/user/update', api.user.center.update)
router.put('/user/reset', api.user.center.reset)

module.exports = router
