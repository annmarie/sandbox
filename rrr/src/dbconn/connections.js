// - database connection - //
const mysql = require('mysql')
const mysqldata = require('../../config/dbconf').mysql

const connections = {

  // create mysql connection
  mysql: mysql.createConnection({
    host: mysqldata.host,
    user: mysqldata.user,
    password: mysqldata.password,
    database: mysqldata.database,
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
