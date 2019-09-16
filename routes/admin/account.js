const router = require('koa-router')()
const admin = require('../../controllers/admin')

router.get('/account/findRoot', admin.account.user.getFindRoot)
router.post('/account/create', admin.account.user.createRoot)

module.exports = router
