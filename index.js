const path=require('path')
const express=require('express')
const dotenv=require('dotenv')
const connectDB=require('./config/db')
const morgan=require('morgan')
const exphbs=require('express-handlebars')
const passport=require('passport')
const session=require('express-session')
//Load config 
dotenv.config({path:'./config/config.env'})
connectDB()
// Passport config
require('./config/passport')(passport)
const app=express()
if (process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))

}
// Handlebars 
app.engine('.hbs',exphbs.engine({defaultLayout:'main', extname:'.hbs'}))
app.set('view engine','.hbs')
app.use(session({
    secret:'keyword cat',
    resave:false,
    saveUninitialized:false,
    
}))

// Middlewares 
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname,'public')))

const PORT=process.env.PORT||5000
// Routes 
app.use("/",require('./routes/index'))
app.use("/auth",require('./routes/auth'))
app.listen(PORT,console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`))

