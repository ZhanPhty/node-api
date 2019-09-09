const router = require('koa-router')()
const api = require('../../controllers/api')

router.get('/reg/check/account', api.user.reg.checkUsername)
router.post('/reg', api.common.service.checkCaptcha, api.user.reg.register, api.common.service.sendMail)
router.post('/login', api.common.service.checkCaptcha, api.user.login.login)
router.get('/user/center', api.user.center.info)
router.put('/user/update', api.user.center.update)
router.put('/user/reset', api.user.center.reset)
router.get('/user/:id/center', api.user.center.other)
router.get('/user/:id/article', api.user.center.article)
router.get('/user/:id/like', api.user.center.like)

module.exports = router
