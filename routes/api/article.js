const router = require('koa-router')()
const api = require('../../controllers/api')

router.get('/articles', api.article.article.list)
router.get('/article/hot', api.article.article.hot)
router.post('/article/section', api.article.article.updateTag, api.article.article.publish)
router.put('/article/section/:id', api.article.article.getById, api.article.article.updateTag, api.article.article.update)
router.delete('/article/section/:id', api.article.article.getById, api.article.article.delete)
router.get('/article/detail/:id', api.article.article.getById, api.article.article.single)

module.exports = router
