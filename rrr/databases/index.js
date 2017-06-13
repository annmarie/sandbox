// - databases - //
const mysql = require('mysql')

const dbs = {
  mysql: {
    host: 'localhost',
    user: 'root',
    password: '',
    dbname: 'recibes_dev'
  }
}

const connections = {
  // create mysql connection
  mysql: mysql.createConnection({
    host: dbs.mysql.host,
    user: dbs.mysql.user,
    password: dbs.mysql.password,
    database: dbs.mysql.dbname,
    multipleStatements: true
  })
}

// connect to mysql
connections.mysql.connect((err) => {
  if (err) {
    console.log("mysql error")
    console.log(err.code);
    console.log(err.fatal);
  }
})

module.exports = connections