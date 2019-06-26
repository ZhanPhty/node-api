const router = require('koa-router')()
const api = require('../../controllers/api')

router.get('/article/list', api.article.article.list)

module.exports = router
