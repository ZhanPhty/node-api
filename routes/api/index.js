const router = require('koa-router')()

const user = require('./user')
const public = require('./public')

router.prefix('/blogapi')
router.use(user.routes())
router.use(public.routes())

module.exports = router
