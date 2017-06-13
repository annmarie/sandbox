// - Tag Model - //
const db = require('../dbconn')
const Q = require('q')
const _ = require('lodash')

class Tag {

  constructor(data) {
    this.id = _.get(data, 'id', "")
    this.item = _.get(data, "item", _.get(data, "tag_item", ""))
    this.updated_at = _.get(data, 'updated_at', "")
    this.created_at = _.get(data, 'created_at', "")
  }

   save() {
     const select = () => {
       const q = Q.defer()
       if (!this.item) {
         q.resolve({})
         return q.promise
       }

       const query = "SELECT * FROM tag WHERE tag_item=?"
       const qargs = [this.item]

       db.query(query, qargs)
       .then(rows => {
         const rset = _.head(rows)
         if (!rset)
           q.resolve({})
         else
           q.resolve(new Tag(rset))
       })
       .catch(err => q.reject(err))
       return q.promise
     }

     const insert = () => {
       const q = Q.defer()
       if (!this.item) {
         q.reject("item is required")
         return q.promise
       }

       const query = "INSERT INTO tag SET tag_item=?"
       const qargs = [this.item]

       return db.query(query, qargs)
       .then(rows => {
         this.id = _.get(rows, "insertId")
         return select()
       })
     }

     return select().then(tag => _.isEmpty(tag) ? insert() : tag)
   }
}

module.exports = Tag
