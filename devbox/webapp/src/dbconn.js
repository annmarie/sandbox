const Q = require('q')
const dbs = require('../databases')

module.exports = {

  sitedb: dbCallPromiseWrap(dbs.sitedb)

}

function dbCallPromiseWrap(db) {
  return {
    // a query with a promise
    query: (query, qargs) => {
      const q = Q.defer()
      db.query(query, qargs, (err, res) => {
        if (err)
          q.reject(err)
        else
          q.resolve(res)
      })
      return q.promise
    },

    escape: (i) => db.escape(i),
  }
}
