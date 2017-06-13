// - RecipeTag Model - //
const db = require('../dbconn')
const Q = require('q')
const _ = require('lodash')

class RecipeTag {

  constructor(data) {
    this.id = _.get(data, 'id', "")
    this.rcp_id = _.get(data, "rcp_id", "")
    this.tag_id = _.get(data, "tag_id", "")
    this.tag_item = _.get(data, "tag_item", "")
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

      const query = "SELECT recipe_tag.*,tag_item " +
        " FROM recipe_tag INNER JOIN tag " +
        " WHERE recipe_tag.tag_id=tag.id AND recipe_tag.id=?"
      const qargs = [this.id]

      db.query(query, qargs)
      .then(rows => {
        const rset = _.head(rows)
        if (!rset)
          q.reject("record not found")
        else
          q.resolve(new RecipeTag(rset))
      })
      .catch(err => q.reject(err))
      return q.promise
    }

    const insert = () => {
      const q = Q.defer()
      if (!this.rcp_id) {
        q.reject("recipe is required")
        return q.promise
      } else if (!this.tag_id) {
        q.reject("tag is required")
        return q.promise
      }

      const query = "INSERT INTO recipe_tag (rcp_id, tag_id) VALUES (?,?) "
      const qargs = [this.rcp_id, this.tag_id]

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

module.exports = RecipeTag
