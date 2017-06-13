const User = require('../src/models/User')
const Recipe = require('../src/models/Recipe')

const newuser = new User()
newuser.email = "admin@localhost"
newuser.password = "admin"
newuser.admin = true

const newrcp = new Recipe()
newrcp.headline = "Bowl of blueberries"
newrcp.body = "Clean the blueberries.  Put in bowl"

newuser.save().then(usr => {
  newrcp.usr_id = usr.id
  return newrcp.save()
  .then(rcp => {
    return rcp.addIngredient("blueberries")
    .then(ingr => {
      return rcp.addTag("summer")
      .then(tag => [usr, rcp, ingr, tag])
    })
  })
})
.spread((usr, rcp, ingr, tag) => {
  console.log(usr)
  console.log(rcp)
  console.log(ingr)
  console.log(tag)
})
.catch(err => console.log(err))
.finally(() => process.exit())

