const { exec, escape, filesExec } = require('../db/mysql')
const xss = require('xss')
const getFileList = async (resData) => {
    let pageIndex = resData.pageIndex
    let pageSize = resData.pageSize
    let startIndex = pageIndex * pageSize
    let sql = `select * from files where 1=1`
    if (resData.pageIndex !== undefined && resData.pageSize !== undefined) {
        sql = `select * from files where id >=(select id From files Order By id limit ${startIndex},1) limit ${pageSize};`
    }
    // if (resData.author) {
    //     sql += `and  author ='${resData.author}'`
    // }
    // if (keyword) {
    //     sql += `and fileName like '%${resData.keyword}%'`
    // }
    // sql += ` order by createTime desc;`
    return await exec(sql)
}

const uploadFile = async (fileData = {}) => {
    let fileName = fileData.fileName
    let fileType = fileData.fileType
    let storType = fileData.storType
    let fileSize = fileData.fileSize
    let fileUrl = fileData.fileUrl
    let createTime = Date.now()
    let updateTime = Date.now()
    console.log('11111111111')
    console.log(fileData.fileName)
    // author
    console.log()
    let sql = `insert into files (fileName, fileType, storType, fileSize, createTime, updateTime, fileUrl) values 
        ('${fileName}', '${fileType}', '${storType}', ${fileSize}, ${createTime}, ${updateTime}, '${fileUrl}');`
    const insertData =  await exec(sql)
    return {
        id: insertData.insertId
    }
}
const uploadFiles = async (fileDataArr = []) => {
    let sqls = []
    for (let i = 0; fileDataArr.length; i++) {
      let fileName = fileData.fileName
      let fileType = fileData.fileType
      let storType = fileData.storType
      let fileSize = fileData.fileSize
      let createTime = fileData.createTime
      let updateTime = fileData.updateTime
      // author
      console.log()
      let sql = `insert into files (fileName, fileType, storType, fileSize, createTime, updateTime) values 
          ('${fileName}', '${fileType}', '${storType}', ${fileSize}, ${createTime}, ${updateTime});`
      sqls.push(sql)
    }
    const insertData =  await filesExec(sqls)
    return {
        data: insertData
    }
}

const updateFile = async (fileDate = {}) => {
    let oldName = fileDate.oldName
    let newName = escape(fileDate.newName)
    let fileUrl = fileDate.fileUrl
    let updateTime = Date.now()
    let sql = `update files set fileName=${newName}, fileUrl='${fileUrl}', updateTime='${updateTime}' where fileName='${oldName}'`
    let insertSQL = `select * from files where fileName=${newName}`
    await exec(sql)
    const insertDate = await exec(insertSQL)
    return {
        data: insertDate
    }
}

const deleteFile = async (fileData = {}) => {
    let fileName = fileData.fileName
    let sql = `delete from files where fileName='${fileName}'`
    const deleteData = await exec(sql)
    return {
        data: deleteData
    }
}

module.exports = {
    getFileList,
    uploadFile,
    uploadFiles,
    updateFile,
    deleteFile
}