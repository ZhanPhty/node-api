const crypto = require('crypto')
const should = require('should')
const request = require('supertest')
const app = require('../../../app').listen(3000)

describe('=== 文章模块 ===', () => {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI1ZDBjODkzY2UwMzU4ZTUyYzQwNDE1NDgiLCJpYXQiOjE1NjE1MzU2MzAsImV4cCI6MTU2NDEyNzYzMH0.I6uld3fLCL33wAuJl1zRMQnwqUZpOskjYKBsOfCaUxI'
  it('--- 1.发布文章 ---', done => {
    request(app)
      .post('/blogapi/article/publish')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '测试文章',
        content: '文章内容',
        type: '1',
        category: '1'
      })
      .expect(200, (err, res) => {
        should.not.exist(err)
        res.status.should.equal(200)
        res.body.code.should.equal(200)
        done()
      })
  })
})
