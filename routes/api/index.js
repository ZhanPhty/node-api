const router = require('koa-router')()

const user = require('./user')
const common = require('./common')
const article = require('./article')
const action = require('./action')
const select = require('./select')

router.prefix('/blogapi')
router.use(user.routes())
router.use(common.routes())
router.use(article.routes())
router.use(action.routes())
router.use(select.routes())

module.exports = router
