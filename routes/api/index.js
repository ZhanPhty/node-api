const router = require('koa-router')()

const user = require('./user')
const common = require('./common')

router.prefix('/blogapi')
router.use(user.routes())
router.use(common.routes())

module.exports = router
