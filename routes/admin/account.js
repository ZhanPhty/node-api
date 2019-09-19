const router = require('koa-router')()
const admin = require('../../controllers/admin')

router.get('/account/findRoot', admin.account.user.getFindRoot)
router.post('/account/create', admin.account.user.createRoot)
router.post('/account/login', admin.account.user.login)
router.post('/account/loginOut', admin.account.user.loginOut)
router.get('/account/admins', admin.auth.auth.verify, admin.account.user.list)
router.put(
  '/account/admin/:id',
  admin.auth.auth.verify,
  admin.account.user.getById,
  admin.account.user.update
)
router.delete('/account/admin/:id', admin.auth.auth.verify, admin.account.user.delete)
router.put('/account/apply/:id', admin.auth.auth.verify, admin.account.user.getById, admin.account.user.apply)

module.exports = router
