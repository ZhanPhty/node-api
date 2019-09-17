const router = require('koa-router')()
const admin = require('../../controllers/admin')

router.get('/account/findRoot', admin.account.user.getFindRoot)
router.post('/account/create', admin.account.user.createRoot)
router.post('/account/login', admin.account.user.login)
router.post('/account/loginOut', admin.account.user.loginOut)
router.get('/account/admins', admin.auth.auth.verify, admin.account.user.list)

module.exports = router
