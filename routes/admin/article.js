const router = require('koa-router')()
const admin = require('../../controllers/admin')

router.get('/articles', admin.article.article.list)
router.put('/article/:id/status', admin.article.article.status)
router.put('/article/:id/toped', admin.article.article.toped)

module.exports = router
