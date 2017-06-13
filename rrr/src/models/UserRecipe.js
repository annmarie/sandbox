// - UserRecipe Model - //
const db = require('../dbconn')
const Q = require('q')
const _ = require('lodash')

class UserRecipe {

  constructor(data) {
    this.id = _.get(data, 'id', "")
    this.usr_id = _.get(data, "usr_id", "")
    this.rcp_id = _.get(data, "rcp_id", "")
    this.updated_at = _.get(data, 'updated_at', "")
    this.created_at = _.get(data, 'created_at', "")
  }

  save() {
    const select = () => {
      const q = Q.defer()
      if (!this.id) {
        q.resolve({})
        return q.promise
      }

      const query = "SELECT * FROM user_recipe WHERE id=?"
      const qargs = [this.id]

      db.query(query, qargs)
      .then(rows => {
        const rset = _.head(rows)
        if (!rset)
          q.reject("record not found")
        else
          q.resolve(new UserRecipe(rset))
      })
      .catch(err => q.reject(err))
      return q.promise
    }

    const insert = () => {
      const q = Q.defer()
      if (!this.rcp_id) {
        q.reject("recipe is required")
        return q.promise
      }

      const query = "INSERT INTO user_recipe (usr_id,rcp_id) VALUES (?,?) "
      const qargs = [this.usr_id,this.rcp_id]

      return db.query(query, qargs)
      .then(rows => {
        this.id = _.get(rows, "insertId")
        return select()
      })
    }

    return select()
    .then(rcp_tag => _.isEmpty(rcp_tag) ? insert() : rcp_tag) 
  }
}

module.exports = UserRecipe
