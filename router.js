const express = require('express')

const BaseRouter  =  express.Router()
const AccountRouter = express.Router()
const ConnectionsRouter = express.Router()

BaseRouter.get('/',(req,res,next)=>{
    res.render('home',{title:'home'})
})
.get('/taskpanel',(req,res,next)=>{
    res.render('taskpanel',{title:'task panel'})
})

ConnectionsRouter.get('/',(req,res,next)=>{
    res.render('connections',{title:'connections'})
})
.get('/task',(req,res,next)=>{
    res.render('task',{title:'assign task'})
})
.get('/chat',(req,res,next)=>{
    res.render('chat',{title:'chat'})
})


AccountRouter.get('/login',(req,res,next)=>{
    res.render('login',{title:'login'})
})
.get('/signup',(req,res,next)=>{
    res.render('signup',{title:'signup'})
})

module.exports = {BaseRouter,AccountRouter,ConnectionsRouter}




