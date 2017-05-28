// - database tools - //
const mysql = require('./connections').mysql
const Q = require('q')

module.exports = {

  // a query with a promise
  query: (query, qargs) => {
    const q = Q.defer()
    mysql.query(query, qargs, (err, res) => {
      if (err)
        q.reject(err)
      else
        q.resolve(res)
    })
    return q.promise
  }
}
