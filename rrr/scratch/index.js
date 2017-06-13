const db = require('../src/dbconn')
const _ = require('lodash')
const Q = require('q')

const Ingredient = require('../src/models/Ingredient')
const Recipe = require('../src/models/Recipe')
const Recipes = require('../src/collections/Recipes')
const RecipeIngredient = require('../src/models/RecipeIngredient')
const RecipeTag = require('../src/models/RecipeTag')
const Tag = require('../src/models/Tag')
const User = require('../src/models/User')
const Users = require('../src/collections/Users')


// new Users({id: 1}).findOne()
// .then(r => console.log(r))
// .catch(e => console.log(e))

// new Recipes().searchHeadlines('recipe')
// .then(r => console.log(r))
// .catch(e => console.log(e))
// .finally(() => process.exit())

// new Recipes().searchIngredients('blueberries')
// .then(r => console.log(r))
// .catch(e => console.log(e))
// .finally(() => process.exit())

new Recipes().searchKeywords('summer')
.then(r => console.log(r))
.catch(e => console.log(e))
.finally(() => process.exit())

