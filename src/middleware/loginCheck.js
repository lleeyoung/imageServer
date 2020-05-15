const { ErrorModel } = require('../model/resModel')

module.exports = async (ctx, next) => {
    console.log('ctx is', ctx)
    console.log('ctx.session is', ctx.session)
    if (ctx.session.username) {
        await next()
        return
    }
    ctx.body = new ErrorModel('未登录')
}