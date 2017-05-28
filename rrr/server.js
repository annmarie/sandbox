// - server - //
const express = require('express')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()
const port = process.env.PORT || 8118

require('./src/passport')(passport)

// express stuff
app.use(morgan('dev'))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'src/views'))

// required for passport
app.use(session({
    secret: 'x1tgUSYx1tuEUpAzu05QGZ7gUSYx1t8EUEU',
    cookie: { maxAge: (360000 * 24) * 3 },
    rolling: true,
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// load routes and pass in our app and passport
require('./src/routes')(app, passport)

// listen
app.listen(port)
console.log('Listening on port ' + port)
