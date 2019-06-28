const crypto = require('crypto')
const should = require('should')
const request = require('supertest')
const app = require('../../../app').listen(config.port)

describe('=== 用户注册模块 ===', () => {
  let code = '1111'
  it('--- 1.获取图片验证码 ---', done => {
    request(app)
      .get('/blogapi/service/captcha?text=' + code)
      .expect(200, (err, res) => {
        should.not.exist(err)
        res.status.should.equal(200)
        done()
      })
  })

  it('--- 2.注册 ---', done => {
    request(app)
      .post('/blogapi/reg')
      .send({
        account: `ceshi-${Date.now()}`,
        email: 'liuhaitao@cycredit.com.cn',
        password: crypto
          .createHash('md5')
          .update('111111')
          .digest('hex'),
        nick: '小辉哥',
        captcha: code
      })
      .expect(200, (err, res) => {
        should.not.exist(err)
        res.status.should.equal(200)
        res.body.code.should.equal(200)
        done()
      })
      .expect(400, (err, res) => {
        done()
      })
  })

  // it('检查用户名', function (done) {
  //   request(app).get('/blogapi/reg/check/username?username=liuhaitao@cycredit.com.cn')
  //     .expect(200, function (err, res) {
  //       should.not.exist(err);
  //       // res.status.should.equal(200);
  //       console.log(res.body)
  //       console.log(err)
  //       done();
  //     });
  // })
})
