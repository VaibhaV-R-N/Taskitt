const express = require('express')
const passport = require('passport')
const {User} = require('./models')
const {asyncCatcher} = require('./middlewares')
const AppError = require('./AppError')
const BaseRouter  =  express.Router()
const AccountRouter = express.Router()
const ConnectionsRouter = express.Router()

const checkError = (req)=>{
    const message = req.session.message?req.session.message:undefined
    delete req.session.message
    return {message}
}


BaseRouter.get('/',(req,res,next)=>{
    res.render('home',{title:'home',message:checkError(req).message})
})
.get('/taskpanel',(req,res,next)=>{
    res.render('taskpanel',{title:'task panel',message:checkError(req).message})
})

ConnectionsRouter.get('/',(req,res,next)=>{
    res.render('connections',{title:'connections',message:checkError(req).message})
})
.get('/task',(req,res,next)=>{
    res.render('task',{title:'assign task',message:checkError(req).message})
})
.get('/chat',(req,res,next)=>{
    res.render('chat',{title:'chat',message:checkError(req).message})
})
.post('/add',asyncCatcher(async (req,res,next)=>{
    const userid = req.body.userid
    const user = await User.findOne({userid:userid})
    res.json({user})
}))


AccountRouter.get('/login',(req,res,next)=>{
    res.render('login',{title:'login',message:checkError(req).message})
})
.get('/signup',(req,res,next)=>{
    res.render('signup',{title:'signup',message:checkError(req).message})
})
.post('/signup',asyncCatcher(async (req,res,next)=>{
    const newUser = new User({username:req.body.username})
    newUser.userid = newUser._id.toString().substring(19)
    if(req.body.password === req.body.cpassword){
        const regUser = await User.register(newUser,req.body.password)
        req.login(regUser,async err=>{
            if(err){
                return res.redirect('/account/login')
            }
            return res.redirect('/taskpanel')
        })
    }else return next(new AppError('password do not match','400')) 
}))
.post('/login',passport.authenticate('local',{failureRedirect:'/account/login',successRedirect:'/connections'}))
.get('/logout',(req,res,next)=>{
    req.logOut((e)=>{
        if(e) return res.redirect(req.originalUrl)
        return res.redirect('/account/login')
    })
})


module.exports = {BaseRouter,AccountRouter,ConnectionsRouter}




