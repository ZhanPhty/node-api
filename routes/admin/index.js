const router = require('koa-router')()

const account = require('./account')
const article = require('./article')

router.prefix('/blogadmin')
router.use(account.routes())
router.use(article.routes())

module.exports = router
