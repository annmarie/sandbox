// - RecipeIngredient Model - //
const db = require('../dbconn')
const Q = require('q')
const _ = require('lodash')

class RecipeIngredient {

  constructor(data) {
    this.id = _.get(data, 'id', "")
    this.rcp_id = _.get(data, "rcp_id", "")
    this.ingr_id = _.get(data, "ingr_id", "")
    this.amount = _.get(data, "amount", _.get(data, "ingr_amount", ""))
    this.notes = _.get(data, "notes", _.get(data, "ingr_notes", ""))
    this.order = _.get(data, "order", _.get(data, "ingr_order", 0))
    this.ingr_item = _.get(data, "ingr_item", "")
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

      const query = "SELECT recipe_ingredient.*, ingr_item " +
        " FROM recipe_ingredient INNER JOIN ingredient " +
        " WHERE recipe_ingredient.ingr_id=ingredient.id AND recipe_ingredient.id=?"
      const qargs = [this.id]

      db.query(query, qargs)
      .then(rows => {
        const rset = _.head(rows)
        if (!rset)
          q.reject("record not found")
        else
          q.resolve(new RecipeIngredient(rset))
      })
      .catch(err => q.reject(err))
      return q.promise
    }

    const insert = () => {
      const q = Q.defer()
      if (!this.rcp_id) {
        q.reject("recipe is required")
        return q.promise
      } else if (!this.ingr_id) {
        q.reject("ingredient is required")
        return q.promise
      }

      const query = "INSERT INTO recipe_ingredient " +
        " (rcp_id,ingr_id,ingr_amount,ingr_order,ingr_notes) " +
        " VALUES (?,?,?,?,?) "
      const qargs = [this.rcp_id, this.ingr_id, this.amount, this.order, this.notes]

      return db.query(query, qargs)
      .then(rows => {
        this.id = _.get(rows, "insertId")
        return select()
      })
    }

    const update = (rcp_ingr) => {
      const amount = (this.amount) ? this.amount : rcp_ingr.amount
      const order = (this.order) ? this.order : rcp_ingr.order
      const notes = (this.notes) ? this.notes : rcp_ingr.notes

      const q = Q.defer()
      if ((amount == rcp_ingr.amount) &&
          (order == rcp_ingr.order) &&
          (order == rcp_ingr.notes)) {
        q.reject("nothing to update")
        return q.promise
      }

      const query = "UPDATE recipe_ingredient SET " +
            " ingr_amount=?, ingr_order=? ingr_notes=? " +
            " WHERE rpc_id=? AND ingr_id=?"
      const qargs = [ this.amount, this.order, this.notes,
        this.rcp_id, this.ingr_id ]

      return db.query(query, qargs).then(() => select())
    }

    return select()
    .then(rcp_ingr => _.isEmpty(rcp_ingr) ? insert() : update(rcp_ingr))
  }
}

module.exports = RecipeIngredient
