const router = require('koa-router')()
const admin = require('../../controllers/admin')

router.get('/articles', admin.article.article.list)
router.put('/article/:id/status', admin.article.article.status)
router.put('/article/:id/toped', admin.article.article.toped)
// 文章相关的数据 - 博客类型
router.get('/types', admin.article.type.list)
router.post('/type/create', admin.article.type.create)
router.put('/type/:id', admin.article.type.update)
router.delete('/type/:id', admin.article.type.del)
// 文章分类
router.get('/categories', admin.article.category.list)
router.post('/category/create', admin.article.category.create)
router.put('/category/:id', admin.article.category.update)
router.delete('/category/:id', admin.article.category.del)
// 文章标签
router.get('/tags', admin.article.tag.list)
router.post('/tag/create', admin.article.tag.create)
router.put('/tag/:id', admin.article.tag.update)
router.delete('/tag/:id', admin.article.tag.del)
// banner广告
router.get('/banners', admin.article.banner.list)
router.post('/banner/create', admin.article.banner.create)
router.put('/banner/:id', admin.article.banner.update)
router.delete('/banner/:id', admin.article.banner.del)

module.exports = router
