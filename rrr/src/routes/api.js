// - api routes - //
const Users = require('../collections/users')

module.exports = (app, utils) => {

    app.get('/api', utils.hasAuth, (req, res) => {
      res.json({ urls: [
          "/api",
          "/api/me",
          "/api/user/:id",
          "/api/users"
        ]
      })
    })

    app.get('/api/me', utils.hasAuth, (req, res) => {
      const me = req.user
      res.json({me})
    })

    app.get('/api/user', utils.hasAuth, (req, res) => {
      res.json(req.user)
    })

    app.get('/api/user/:id', utils.hasAuth, (req, res) => {
      const id = req.params.id
      new Users({id}).findOne()
      .then(user => res.json(user))
      .catch(err => res.status(500).send('500 error'))
    })

    app.get('/api/users', utils.hasAuth, (req, res) => {
      const limit = utils.cleanInt(req.query.limit, 10)
      const offset = utils.cleanInt(req.query.offset, 0)
      new Users({limit, offset}).findAll()
      .then(users => res.json(users))
      .catch(err => res.status(500).send('500 error'))
    })
}
