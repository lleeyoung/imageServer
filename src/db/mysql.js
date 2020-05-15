const mysql = require('mysql')
const { MYSQL_CONF } = require('../conf/db')

// //创建连接对象
const con = mysql.createConnection(MYSQL_CONF)
// console.log(MYSQL_CONF)
// //开始连接
con.connect()
// const sql = 'select * from files;'
// con.query(sql, (err, result) => {
//     if (err) {
//         console.log(err)
//         return
//     }
//     console.log(result)
// })
// con.end()
// const sql = 'select * from files;'
//统一执行sql的函数
function exec (sql) {
    const promise = new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            if (err) {
                reject(err)
                console.log('err')
                return
            }
            resolve(result)
            console.log('ok')
        })
    })
    return promise
}
//批量上传文件执行sql promise.all
function filesExec (sqls) {
  return Promise((res, rej) => {
    let sqlsPromise = []
    for (let i = 0; i < sqls.length; i++) {
        let promise =  new Promise((resolve, reject) => {
            con.query(sql, (err, result) => {
                if (err) {
                    reject(err)
                    console.log('err')
                    return
                }
                resolve(result)
                console.log('ok')
            })
        })
        sqlsPromise.push(promise)
    }
    Promise.all(sqlsPromise).then((values) => {
      res(values)
    }).catch ((err) => {
        console.log('file Promise.all err')
        console.log(err)
        rej(err)
    })
  })
}
module.exports = {
    exec,
    escape: mysql.escape,
    filesExec
}