// - api routes - //
const Users = require('../collections/Users')
const Recipes = require('../collections/Recipes')
const _ = require('lodash')

module.exports = (app, tools, passport) => {

  app.get('/api/login', (req, res) => {
    let status = false
    let message = "You are not logged in."
    if (req.user) {
      status = true
      message = "You are logged in."
      flashMsg = req.flash('loginMessage').join(' ')
      if (flashMsg)
        message = flashMsg
    } else {
      status = false
      flashMsg = req.flash('loginMessage').join(' ')
      if (flashMsg)
        message = flashMsg
    }
    res.json({ status, message })
  })

  app.post('/api/login', (req, res, next) => {
    if (!req.body.email || (!req.body.password)) {
      req.flash(this.messageKey, 'Credentials not valid.')
    }
    next()
  },
  passport.authenticate('site-login', {
      successRedirect : '/api/login',
      failureRedirect : '/api/login',
      failureFlash : true
  }))

  app.get('/api/me', (req, res) => {
    const me = req.user || {error: "no user"}
    const status = (req.user) ? true : false
    res.json({ me, status })
  })

  app.get('/api/user', tools.hasAuth, (req, res) => {
    const user = req.user
    res.json({ user })
  })

  app.get('/api/user/:id', tools.hasAuth, (req, res) => {
    const id = req.params.id
    new Users({ id }).findOne()
    .then(rset => res.json(rset))
    .catch(err => res.status(500).send('500 error'))
  })

  app.get('/api/users', tools.hasAuth, (req, res) => {
    const limit = tools.cleanInt(req.query.limit, 10)
    const offset = tools.cleanInt(req.query.offset, 0)
    new Users({ limit, offset }).findAll()
    .then(rset => res.json(rset))
    .catch(err => res.status(500).send('500 error'))
  })

  app.get('/api/recipe/:id', tools.hasAuth, (req, res) => {
    const id = req.params.id
    new Recipes({ id }).findOne()
    .then(rcp => [
      rcp,
      rcp.getIngredients(),
      rcp.getTags(),
      new Users({id: rcp.usr_id}).findOne()
    ])
    .spread((rcp, ingrs, tags, usr) => {
       rcp.ingredients = ingrs
       rcp.tags = tags
       rcp.user = usr
       res.json(rcp)
    })
    .catch(err => res.status(500).send('500 error ' + err))
  })

  app.get('/api/recipes', tools.hasAuth, (req, res) => {
    const find = () => {
      const qterm = req.query.q
      const limit = tools.cleanInt(req.query.limit, 10)
      const offset = tools.cleanInt(req.query.offset, 0)
      const by = req.query.by
      const recipes =  new Recipes({ limit, offset })

      if (!qterm)
        return recipes.findAll()
      else if (by === 'ingredients')
        return recipes.searchIngredients(qterm)
      else if (by === 'tags')
        return recipes.searchTags(qterm)
      else
        return recipes.searchKeywords(qterm)
    }

    find().then(rset => res.json(rset))
    .catch(err => res.status(500).send('500 error ' + err))
  })
}

