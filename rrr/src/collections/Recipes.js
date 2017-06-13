// - Recipes Collection - //
const db = require('../dbconn')
const mysql = require('../../databases').mysql
const Recipe = require('../models/Recipe')
const striptags = require('striptags')
const stopwords = require('../tools/stopwords')
const Q = require('q')
const _ = require('lodash')

class Recipes {

  constructor(data) {
    this.id = _.get(data, 'id', "")
    this.headline = _.get(data, 'headline', "")
    this.limit = _.get(data, 'limit', 10)
    this.offset = _.get(data, 'offset', 0)
  }

  searchHeadlines(phrase) {
    const q = Q.defer()
    if (!phrase) {
      q.reject("request not valid")
      return q.promise
    }

    const query = "SELECT recipe.*,usr_id FROM recipe " +
      " INNER JOIN user_recipe " +
      " WHERE recipe.id=user_recipe.rcp_id "
      " AND rcp_headline LIKE ? " +
      " ORDER BY rcp_headline ASC " +
      " LIMIT ? OFFSET ? "
    const qargs = [phrase +"%", this.limit, this.offset]

    return this._queryMany(query, qargs)
  }

  searchKeywords(phrase) {
    const q = Q.defer()
    if (!phrase) {
      q.reject("request not valid")
      return q.promise
    }

    phrase = striptags(phrase).replace(/&\w+;/g, '')
    const words = _.difference(phrase.match(/\b[\w+]+\b/g), stopwords)

    const query = "SELECT recipe.*,usr_id, COUNT(*) AS occurrences " +
      " FROM recipe, word, occurrence " +
      " JOIN user_recipe " +
      " WHERE recipe.id = user_recipe.rcp_id " +
      " AND recipe.id = occurrence.rcp_id " +
      " AND word.id = occurrence.word_id " +
      _.map(words, word => {
        return " AND word.word_item=" + mysql.escape(word)
      }).join('') +
      " GROUP BY recipe.id,usr_id ORDER BY occurrences DESC "
      " LIMIT ? OFFSET ? "
    const qargs = [this.limit, this.offset]

    return this._queryMany(query, qargs)
  }

  searchIngredients(phrase) {
    const q = Q.defer()
    if (!phrase) {
      q.reject("request not valid")
      return q.promise
    }

    const query = "SELECT recipe.*,usr_id FROM ingredient, recipe_ingredient " +
      " JOIN recipe " +
      " ON recipe_ingredient.rcp_id = recipe.id " +
      " INNER JOIN user_recipe " +
      " WHERE ingredient.id = recipe_ingredient.ingr_id " +
      " AND recipe.id = user_recipe.rcp_id " +
      " AND ingredient.ingr_item LIKE ? " +
      " ORDER BY rcp_headline ASC " +
      " LIMIT ? OFFSET ? "
    const qargs = [phrase +"%", this.limit, this.offset]

    return this._queryMany(query, qargs)
  }

  searchTags(phrase) {
    const q = Q.defer()
    if (!phrase) {
      q.reject("request not valid")
      return q.promise
    }

    const query = "SELECT recipe.*,usr_id FROM tag, recipe_tag " +
      " JOIN recipe " +
      " ON recipe_tag.rcp_id = recipe.id " +
      " INNER JOIN user_recipe " +
      " WHERE tag.id = recipe_tag.tag_id " +
      " AND recipe.id = user_recipe.rcp_id " +
      " AND tag.tag_item LIKE ? " +
      " ORDER BY rcp_headline ASC " +
      " LIMIT ? OFFSET ? "
    const qargs = [phrase +"%", this.limit, this.offset]

    return this._queryMany(query, qargs)
  }

  findOne() {
    const q = Q.defer()
    const key = (this.id) ? 'id' : (this.headline) ? 'headline' : null

    if (!key) {
      q.reject("request not valid")
      return q.promise
    }

    const qtmpl = "SELECT recipe.*,usr_id FROM recipe " +
      " INNER JOIN user_recipe " +
      " WHERE recipe.id=user_recipe.rcp_id AND recipe.{key}=? " +
      " LIMIT ? OFFSET ? "
    const query = _.replace(qtmpl, "{key}", key)
    const qargs = [this[key], this.limit, this.offset]

    return this._queryOne(query, qargs)
  }

  findAll() {
    const query = "SELECT recipe.*,usr_id FROM recipe " +
      " INNER JOIN user_recipe " +
      " WHERE recipe.id=user_recipe.rcp_id " +
      " ORDER BY rcp_headline " +
      " LIMIT ? OFFSET ? "
    const qargs = [this.limit, this.offset]

    return this._queryMany(query, qargs)
  }

  _queryMany(query, qargs) {
    const q = Q.defer()
    db.query(query, qargs)
    .then(rows => {
      if (!rows.length) {
        q.reject("no records found")
      } else {
        const users = _.map(rows, (row) => new Recipe(row))
        q.resolve(users)
      }
    })
    .catch(err => q.reject(err))
    return q.promise
  }

  _queryOne(query, qargs) {
    const q = Q.defer()
    db.query(query, qargs)
    .then(rows => {
      const data = _.head(rows)
      if (!data)
        q.reject("record not found")
      else
        q.resolve(new Recipe(data))
    })
    .catch(err => q.reject(err))
    return q.promise
  }
}

module.exports = Recipes
