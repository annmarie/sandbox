// - root routes - //
const Users = require('../collections/Users')

module.exports = (app) => {

  app.get('/', (req, res) => {
    res.render('index.ejs', {
      me: req.user
    })
  })

  app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })
}
