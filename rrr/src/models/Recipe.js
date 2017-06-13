// - Recipe Model - //
const db = require('../dbconn')
const Q = require('q')
const _ = require('lodash')
const striptags = require('striptags')
const stopwords = require('../tools/stopwords')
const Ingredient = require('./Ingredient')
const RecipeIngredient = require('./RecipeIngredient')
const Tag = require('./Tag')
const RecipeTag = require('./RecipeTag')
const UserRecipe = require('./UserRecipe')

class Recipe {

  constructor(data) {
    this.id = _.get(data, 'id', "")
    this.headline = _.get(data, "headline", _.get(data, "rcp_headline", ""))
    this.body = _.get(data, "body", _.get(data, "rcp_body", ""))
    this.notes = _.get(data, "notes", _.get(data, "rcp_notes", ""))
    this.usr_id = _.get(data, "usr_id", "")
    this.updated_at = _.get(data, 'updated_at', "")
    this.created_at = _.get(data, 'created_at', "")
  }

  addIngredient(item, amount, notes, order) {
    return new Ingredient({item}).save()
    .then(ingr => {
        const data = ({ rcp_id: this.id, ingr_id: ingr.id, amount, notes, order })
        const newRcpIngr = new RecipeIngredient(data)
        return newRcpIngr.save()
        .then(rcp_tag => [rcp_tag, this.addKeywordText(item)])
        .spread(rcp_tag => rcp_tag)
    })
  }

  addTag(item) {
    return new Tag({item}).save()
    .then(tag => {
        const data = ({ rcp_id: this.id, tag_id: tag.id })
        const newRcpTag = new RecipeTag(data)
        return newRcpTag.save()
        .then(rcp_tag => [rcp_tag, this.addKeywordText(item)])
        .spread(rcp_tag => rcp_tag)
    })
  }

  getIngredients() {
    const q = Q.defer()
    if (!this.id) {
      q.reject("invalid id")
      return q.promise
    }

    const query = "SELECT recipe_ingredient.*, ingr_item " +
      " FROM recipe_ingredient INNER JOIN ingredient " +
      " WHERE recipe_ingredient.ingr_id=ingredient.id AND rcp_id=?"
    const qargs = [this.id]

    return db.query(query, qargs)
    .then(rows => {
      _.each(rows, (val, key, rset) => {
        rset[key] = new RecipeIngredient(val)
      })
      return rows
    })
  }

  getTags() {
    const q = Q.defer()
    if (!this.id) {
      q.reject("invalid id")
      return q.promise
    }

    const query = "SELECT recipe_tag.*,tag_item " +
      " FROM recipe_tag INNER JOIN tag " +
      " WHERE recipe_tag.tag_id=tag.id AND rcp_id=?"
    const qargs = [this.id]

    return db.query(query, qargs)
    .then(rows => {
      _.each(rows, function(val, key, rset) {
        rset[key] = new RecipeTag(val)
      })
      return rows
    })
  }

  addKeywordText(text) {
    const q = Q.defer()
    if ((!text) || (!this.id)) {
      q.resolve()
      return q.promise
    }

    const selWord = (word) => {
      const query = "SELECT id FROM word WHERE word_item=?"
      const qargs = [word]
      return db.query(query, qargs)
    }

    const insWord = (word) => {
      const query = "INSERT INTO word SET word_item=?"
      const qargs = [word]
      return db.query(query, qargs)
    }

    const insOccurence = (word_id, rcp_id) => {
      const query = "INSERT INTO occurrence (word_id, rcp_id) VALUES (?, ?)"
      const qargs = [word_id, rcp_id]
      return db.query(query, qargs)
    }

    const addWordOccurrence = (word) => {
      const q = Q.defer()
      if (!word) {
        q.resolve()
        return q.promise
      }

      const hasWord = (word_id, rcp_id) => insOccurence(word_id, rcp_id)
      const addWord = (word, rcp_id) => insWord(word)
      .then(rows => insOccurence(rows.insertId, rcp_id))

      return selWord(word).then(rows => {
        const rset = _.head(rows)
        return (rset) ? hasWord(rset.id, this.id) : addWord(word, this.id)
      }).then(rows => rows)
    }

    text = striptags(text).replace(/&\w+;/g, '')
    const words = _.difference(text.match(/\b[\w+]+\b/g), stopwords)

    return words.reduce((cur, next) => {
      const addWrdOcc = addWordOccurrence(next)
      return (cur) ? cur.then( () => addWrdOcc ) : addWrdOcc
    }, '')
  }

  indexKeywords() {
    const q = Q.defer()
    if (!this.id) {
      q.reject("id is required")
      return q.promise
    }

    const delWordOccurence = () => {
      const query = "DELETE FROM occurrence WHERE rcp_id=?"
      const qargs = [this.id]
      return db.query(query, qargs)
    }

    return this.getIngredients()
    .then(ingr => [ingr, this.getTags()])
    .spread((rcp_ingrs, rcp_tags) => {

      let text = this.headline + " "
      _.each(rcp_ingrs, (rcp_ingr) => text += rcp_ingr.ingr_item + " ")
      _.each(rcp_tags, (rcp_tag) => text += rcp_tag.tag_item + " " )

      return delWordOccurence().then(() => this.addKeywordText(text))
    })
  }

  save(user) {
    const select = () => {
      const q = Q.defer()
      if (!this.id) {
        q.resolve({})
        return q.promise
      }
      const query = "SELECT recipe.*,usr_id FROM recipe INNER JOIN user_recipe " +
        " WHERE recipe.id=user_recipe.rcp_id AND recipe.id=?"
      const qargs = [this.id]

      db.query(query, qargs)
      .then(rows => {
        const rset = _.head(rows)
        if (!rset)
          q.reject("record not found")
        else
          q.resolve(new Recipe(rset))
      })
      .catch(err => q.reject(err))
      return q.promise
    }

    const insert = () => {
      const q = Q.defer()
      if (!this.headline) {
        q.reject("headline is required")
        return q.promise
      }

      const query = "INSERT INTO " +
        " recipe (rcp_headline, rcp_body, rcp_notes) " +
        " VALUES (?, ?, ?) "
      const qargs = [ this.headline, this.body, this.notes ]

      return db.query(query, qargs)
      .then(rows => {
        this.id = _.get(rows, "insertId")

        return new UserRecipe({usr_id: this.usr_id, rcp_id: this.id}).save()
        .then(() => this.indexKeywords())
        .then(() => select())
      })
    }

    const update = (rcp) => {
      const headline = (this.headline) ? this.headline : rcp.headline
      const body = (this.body) ? this.body : rcp.body
      const notes = (this.notes) ? this.notes : rcp.notes

      const q = Q.defer()
      if ((headline == rcp.headline) &&
          (body == rcp.body) &&
          (notes == rcp.notes)) {
        q.reject("nothing to update")
        return q.promise
      }

      const query = "UPDATE recipe " +
        " SET rcp_headline=?, rcp_body=?, rcp_notes=? WHERE id=? "
      const qargs = [ this.headline, this.body, this.notes, this.id ]

      return db.query(query, qargs)
      .then(() => this.indexKeywords())
      .then(() => select())
    }

    return select().then(rcp => _.isEmpty(rcp) ? insert() : update(rcp))
  }
}

module.exports = Recipe
