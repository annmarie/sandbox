const Q = require('q')
const _ = require('lodash')

const Recipes = require('../src/collections/Recipes')
const Users = require('../src/collections/Users')

const id = 1
const getuser = new Users({ id })
const recipe = new Recipes({ id })

const promises = [

  getuser.findOne(),

  recipe.findOne()
  .then(rcp => [rcp, rcp.getIngredients(), rcp.getTags()])
  .spread((rcp, ingrs, tags) => [rcp, ingrs, tags]),

]

Q.allSettled(promises).then(rows => {
  _.each(rows, (rset) => {
    console.log("---")
    if (rset.state === "fulfilled")
      console.log(rset.value)
    else
      console.log(rset.reason)
  })
}).finally(() => {
  console.log("===")
  process.exit()
})
