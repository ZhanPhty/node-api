const router = require('koa-router')()
const api = require('../../controllers/api')

router.get('/action/checklike/:id', api.article.action.checklike)
router.post('/action/:id/like', api.article.action.like)
router.delete('/action/:id/like', api.article.action.removeLike)
router.get('/action/:id/comments', api.article.action.list)
router.post('/action/:id/comment', api.article.action.comment)

module.exports = router
