const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../tools/cryp')

const login = async (username, password) => {
    username = escape(username)
    password = genPassword(password)
    password = escape(password)

    const sql = `select * from users where username=${username} and password=${password};`
    const rows = await exec(sql)
    return rows[0] || {}
}

module.exports = {
    login
}