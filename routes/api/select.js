const router = require('koa-router')()
const api = require('../../controllers/api')

router.get('/select/types', api.select.select.types)
router.get('/select/category', api.select.select.category)
router.get('/select/tag', api.select.select.tag)

module.exports = router
