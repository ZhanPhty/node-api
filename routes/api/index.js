const router = require('koa-router')()

const user = require('./user')
const common = require('./common')
const article = require('./article')

router.prefix('/blogapi')
router.use(user.routes())
router.use(common.routes())
router.use(article.routes())

module.exports = router
