const express  =  require('express')
const path = require('path')
const session = require('express-session')
const passport = require('passport')
const localStrategy = require('passport-local')
const bodyParser = require('body-parser')

const {BaseRouter,AccountRouter,ConnectionsRouter} = require('./router')
const {User} = require('./models')

const app = express()
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use('/public',express.static(path.join(__dirname,'public')))

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.use(session({
    secret:'vaibhanayak',
    resave:false,
    saveUninitialized:true
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.listen(3000,(e)=>{
    console.log('Listening at port 3000...');
})

app.use((req,res,next)=>{
    res.locals.user = req.user?req.user:undefined
    next()
})
app.use('/',BaseRouter)
app.use('/account',AccountRouter)
app.use('/connections',ConnectionsRouter)

app.use((err,req,res,next)=>{
    console.log(err);
    req.session.message = err.message
    res.redirect(req.originalUrl)
})