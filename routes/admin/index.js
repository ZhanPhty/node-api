const router = require('koa-router')()

const account = require('./account')

router.prefix('/blogadmin')
router.use(account.routes())

module.exports = router
