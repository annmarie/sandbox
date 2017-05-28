// - routes - //

const utils = {

  cleanInt: (int, init) => parseInt(int) || init,

  hasAuth: (req, res, next) => {
    if (req.isAuthenticated())
      return next()
    res.redirect('/')
  }
}

module.exports = (app, passport) => {

  require('./api.js')(app, utils)
  require('./site.js')(app, utils, passport)

}
