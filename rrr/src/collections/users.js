// - users collection - //
const db = require('../dbconn')
const User = require('../models/user.js')
const Q = require('q')
const _ = require('lodash')

class Users {

  constructor(data) {
    this.model = User
    this.id = _.get(data, 'id', "")
    this.email = _.get(data, 'email', "")
    this.limit = _.get(data, 'limit', 10)
    this.offset = _.get(data, 'offset', 0)
  }

  findOne() {
    const q = Q.defer()
    const key = (this.id) ? 'id' : (this.email) ? 'email' : null
    if (!key)
      return q.reject("request not valid")

    const qtmpl = "SELECT * FROM user WHERE {key}=? LIMIT ?"
    const query = _.replace(qtmpl, "{key}", key)
    const qargs = [this[key], 1]

    db.query(query, qargs)
    .then(rows => {
      const data = rows[0]
      if (!data)
        q.reject("record not found")
      else
        q.resolve(new this.model(rows[0]))
    })
    .catch(err => q.reject(err))

    return q.promise
  }

  findMany() {
    const q = Q.defer()
    const key = (this.id) ? 'id' : (this.email) ? 'email' : null
    if (!key)
      return q.reject("request not valid")

    const qtmpl = "SELECT * FROM user WHERE {key} IN (?) LIMIT ? OFFSET ?"
    const query = _.replace(qtmpl, "{key}", key)
    const qargs = [this[key], this.limit, this.offset]

    return this._queryMany(q, query, qargs)
  }

  findAll() {
    const q = Q.defer()
    const query = "SELECT * FROM user LIMIT ? OFFSET ?"
    const qargs = [this.limit, this.offset]

    return this._queryMany(q, query, qargs)
  }

  _queryMany(q, query, qargs) {
    db.query(query, qargs)
    .then(rows => {
      if (!rows.length) {
        q.reject("no records found")
      } else {
        const users = _.map(rows, (row) => new this.model(row))
        q.resolve(users)
      }})
    .catch(err => q.reject(err))

    return q.promise
  }
}

module.exports = Users
