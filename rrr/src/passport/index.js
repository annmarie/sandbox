const LocalStrategy = require('passport-local').Strategy
const Users = require('../collections/Users')
const User = require('../models/User')
const Q = require('q')
const _ = require('lodash')

module.exports = (passport) => {

  passport.serializeUser((user, next) => {
    next(null, user.id)
  })

  passport.deserializeUser((id, next) => {
    new Users({id}).findOne()
    .then(user => next(null, user))
    .catch(err => next(err))
  })

  passport.use('site-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  }, (req, email, password, next) => {
    process.nextTick(() => { // asynchronous
      email = email.toLowerCase()
      new Users({email}).findOne().then(user => {
        if (!user)
          return next(null, false, req.flash('loginMessage', 'User not found.'))

        if (!user.hasValidPassword(password))
          return next(null, false, req.flash('loginMessage', 'Wrong password.'))

        next(null, user, req.flash('loginMessage', 'Login Successful.'))
      })
      .catch(err => {
        next(null, false, req.flash('loginMessage', 'User not found.'))
      })
    })
  }))
}
