const router = require('koa-router')()

const auth = require('./auth')

router.prefix('/blogadmin')
router.use(auth.routes())

module.exports = router
