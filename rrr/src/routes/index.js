// - routes - //
const tools = {
  cleanInt,
  hasAuth
}

module.exports = (app, passport) => {

  require('./api.js')(app, tools, passport)
  require('./root.js')(app, tools, passport)

}

function cleanInt(int, init) { return parseInt(int) || init }

function hasAuth(req, res, next) {
  if (req.isAuthenticated()) return next()
  res.redirect('/')
}

