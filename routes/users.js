const router = require('koa-router')()
const { login } = require('../src/contorller/user')
const { SuccessModel, ErrorModel } = require('../src/model/resModel.js')

router.prefix('/api/users')

router.post('/login', async (ctx, next) => {
  const { username, password } = ctx.request.body
  const res = await login(username, password)
  console.log('res', res)
  if (res.username) {
    ctx.session.username = res.username
    console.log('ctx.session.username login is ', ctx.session)
    ctx.body = new SuccessModel(res, '登录成功')
    return
  }
  ctx.body = new ErrorModel('登录失败')
})

router.post('/isLogin', async (ctx, next) => {
  if (ctx.session.username) {
    ctx.body = new SuccessModel()
    return
  }
  ctx.body = new ErrorModel()
})
router.post('/outLogin', async (ctx, next) => {
  try {
    ctx.session.username = null
    ctx.body = new SuccessModel('退出成功')
  } catch (error) {
    ctx.body = new ErrorModel('退出失败')
  }
})

router.get('/session-test', async (ctx, next) => {
  console.log('ctx.session is', ctx.session)
  if (ctx.session.viewCCount == null) {
    ctx.session.viewCCount = 0
  }
  ctx.session.viewCCount++
  ctx.body = {
    errno: 0,
    viewCCount: ctx.session.viewCCount
  }
})

module.exports = router
