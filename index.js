const path = require('path')
const session = require('express-session')
const MongoStore = require('connect-mongo');
const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const passport = require('passport')
// const session=require('express-session');
const mongoose = require('mongoose');
//Load config 
dotenv.config({ path: './config/config.env' })
connectDB()
// Passport config
require('./config/passport')(passport)
const app = express()
app.use(express.urlencoded({extended:false}))
app.use(express.json())
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))

}
// Handlebars 
app.engine('.hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', '.hbs')
app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({mongoUrl: process.env.MONGO_URI,}),
    })
  )
// Middlewares 
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')))

const PORT = process.env.PORT || 5000
// Routes 
app.use("/", require('./routes/index'))
app.use("/auth", require('./routes/auth'))
app.use("/stories", require('./routes/stories'))
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`))

