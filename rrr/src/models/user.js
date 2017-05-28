// - user model - //
const bcrypt = require('bcrypt-nodejs')
const db = require('../dbconn')
const Q = require('q')
const _ = require('lodash')

class User {

  constructor(data) {
    this.id = _.get(data, 'id', "")
    this.email = _.get(data, 'email', "")
    this.password = _.get(data, 'password', "")
    this.password_digest = _.get(data, 'password_digest', "")
    this.admin = _.get(data, 'admin', "")
    this.updated_at = _.get(data, 'updated_at', "")
    this.created_at = _.get(data, 'created_at', "")
  }

  validPassword(password) {
    return bcrypt.compareSync(password, this.password_digest);
  }

  generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  }

  save() {
    const q = Q.defer()

    // process email
    if (!this.email) {
        q.reject("email is not found")
        return q.promise
    }

    // process admin status
    this.admin = (this.admin) ? 1 : 0

    // process password
    if (this.password) {
      this.password_digest = this.generateHash(this.password)
      this.password = null
    } else {
      q.reject("password not found")
      return q.promise
    }

    // make db query
    const query = 'INSERT INTO user (email, password_digest, admin) VALUES (?, ?, ?)'
    const qargs = [this.email, this.password_digest, this.admin]
    db.query(query, qargs)
    .then(rows => {
      this.id = rows.insertId
      q.resolve(this)
    })
    .catch(err => q.reject(err))
    return q.promise
  }
}

module.exports = User;
