const router = require('koa-router')()
const admin = require('../../controllers/admin')

router.get('/generate/permission', admin.auth.permission.generateAuth)

module.exports = router
