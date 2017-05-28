// - site routes - //
const Users = require('../collections/users')

module.exports = (app, utils, passport) => {

  app.get('/', (req, res) => {
    res.render('index.ejs', {
      signupMessage: req.flash('signupMessage'),
      loginMessage: req.flash('loginMessage'),
      me: req.user
    })
  })

  app.get('/users', utils.hasAuth, (req, res) => {
    const limit = utils.cleanInt(req.query.limit, 10)
    const offset = utils.cleanInt(req.query.offset, 0)
    new Users({limit, offset}).findAll()
    .then(users => {
      res.render('users.ejs', {
        me: req.user,
        users: users
      })
    })
    .catch(err => {
      res.status(500).send('500 error')
    })
  })


  app.get('/signup', (req, res) => {
    res.render('signup.ejs', {
      message: req.flash('signupMessage'),
      me: req.user
    })
  })

  app.post('/signup', passport.authenticate('site-signup', {
    successRedirect : '/',
    failureRedirect : '/signup',
    failureFlash : true
  }))

  app.get('/login', (req, res) => {
    res.render('login.ejs', {
      message: req.flash('loginMessage'),
      me: req.user
    })
  })

  app.post('/login', passport.authenticate('site-login', {
    successRedirect : '/',
    failureRedirect : '/login',
    failureFlash : true
  }))

  app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })
}
