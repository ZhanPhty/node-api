const router = require('koa-router')()
const api = require('../../controllers/api')

router.get('/articles', api.article.article.list)
router.post('/article/publish', api.article.article.publish)

module.exports = router
