const router = require('koa-router')()
const fs = require('fs')
const path = require('path')
const koaBody = require('koa-body')
const { getFileList, uploadFile, uploadFiles, updateFile, deleteFile } = require('../src/contorller/files')
const { SuccessModel, ErrorModel } = require('../src/model/resModel.js')
const loginCheck = require('../src/middleware/loginCheck')
const IMG_PATH = '../public/images/hubaweapp/'
router.prefix('/api/files')
router.get('/list', async (ctx, next) => {
  console.log('ctx.session files is', ctx.session)
  let author = ctx.query.author || ''
  let keyword = ctx.query.keyword || ''
  let pageIndex = ctx.query.pageIndex || undefined
  let pageSize = ctx.query.pageSize || undefined
  let resData = {
    author,
    keyword,
    pageIndex,
    pageSize
  }
  console.log("host is", ctx.request.host)
  const listData = await getFileList(resData)
  ctx.body = new SuccessModel(listData)
})

router.post('/uploadFile',loginCheck, koaBody({
  multipart: true,
  formidable: {
      maxFileSize: 200*1024*1024
  }
}), async (ctx, next) => {
  // const body  = ctx.request.body
  // console.log('body is', body)
  const file = ctx.request.files.file
  console.log('ctx.request.files is')
  console.log(ctx.request.files)
  const reader = fs.createReadStream(file.path)
  let filePath = path.resolve(__dirname, IMG_PATH + `/${file.name}`)
  const upStream = fs.createWriteStream(filePath)
  reader.pipe(upStream)
  let fileName = file.name
  let fileSize = file.size
  let fileType = file.type ? file.type : 'image/png'
  let storType = '标准存储'
  let fileUrl = `http://${ctx.request.host}/images/hubaweapp/${fileName}`
  let createTime = Date.now()
  let updateTime = Date.now()
  let fileData = {
    fileName,
    fileSize,
    fileType,
    storType,
    createTime,
    updateTime,
    fileUrl
  }
  const data = await uploadFile(fileData)
  ctx.body = new SuccessModel(data)
})


router.post('/uploadFiles', loginCheck, koaBody({
  multipart: true,
  formidable: {
      maxFileSize: 200*1024*1024
  }
}), async (ctx, next) => {
  // const body  = ctx.request.body
  const files = ctx.request.files
  console.log('files is', files)
  let filesDataArr = []
  for (let file of files) {
    const reader = fs.createReadStream(file.path)
    let filePath = path.resolve(__dirname, IMG_PATH + `/${file.name}`)
    const upStream = fs.createWriteStream(filePath)
    reader.pipe(upStream)
    let fileName = file.name
    let fileSize = file.size
    let fileType = file.type ? file.type : 'image/png'
    let storType = '标准存储'
    let createTime = Date.now()
    let updateTime = Date.now()
    let fileData = {
      fileName,
      fileSize,
      fileType,
      storType,
      createTime,
      updateTime
    }
    filesDataArr.push(fileData)
  }
  const data = await uploadFiles(filesDataArr)
  const message = '上传成功'
  ctx.body = new SuccessModel(data, message)
})

router.post('/updateFile', loginCheck, async (ctx, next) => {
  
  const body  = ctx.request.body
  let fileUrl = `http://${ctx.request.host}/images/hubaweapp/${body.newName}`
  body.fileUrl = fileUrl
  console.log('updateFile body is ', body)
  const { oldName, newName } = body
  if (!oldName || !newName) {
    ctx.body = new ErrorModel('文件名不能为空')
    return
  }
  let oldPath = path.resolve(__dirname, IMG_PATH + `/${oldName}`)
  let newPath = path.resolve(__dirname, IMG_PATH + `/${newName}`)
  fs.renameSync(oldPath, newPath)
  const data = await updateFile(body)
  const message = '修改成功'
  ctx.body = new SuccessModel(data, message)
})

router.post('/deleteFile', loginCheck, async (ctx, next) => {
  const body  = ctx.request.body
  const { fileName } = body
  if (!fileName) {
    ctx.body = new ErrorModel('文件名不能为空')
    return
  }
  let filePath = path.resolve(__dirname, IMG_PATH + `/${fileName}`)
  fs.unlinkSync(filePath)
  const data = deleteFile(body)
  const message = '删除成功'
  ctx.body = new SuccessModel(data, message)
})

module.exports = router
