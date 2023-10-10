const express = require('express')
const passport = require('passport')
const {User,Chat,Task} = require('./models')
const {asyncCatcher} = require('./middlewares')
const {dateAndTime} = require('./utils')
const AppError = require('./AppError')
const {isLoggedIn,isLoggedInBTS} = require('./middlewares')
const BaseRouter  =  express.Router()
const AccountRouter = express.Router()
const ConnectionsRouter = express.Router()

const checkError = (req)=>{

    const message = req.session.message?req.session.message:undefined
    delete req.session.message

    return message
}

BaseRouter.get('/',(req,res,next)=>{
    res.render('home',{title:'home',message:checkError(req)})
})
.get('/taskpanel',isLoggedIn,asyncCatcher(async (req,res,next)=>{

    res.render('taskpanel',{title:'task panel',message:checkError(req)})
}))
.post('/taskpanel/my',isLoggedInBTS,asyncCatcher(async (req,res,next)=>{
    const my = await Task.find({to:req.user._id}).populate('to').populate('from')
    res.json(my)
}))
.post('/taskpanel/other',isLoggedInBTS,asyncCatcher(async (req,res,next)=>{
    const other = await Task.find({from:req.user._id}).populate('to')
    res.json(other)
}))
.post('/taskpanel/update/progress/:id',isLoggedInBTS,asyncCatcher(async (req,res,next)=>{
        const updated = await Task.findByIdAndUpdate(req.params.id,{progress:req.body.progress},{new:true})
        res.json(updated)
}))
.get('/taskpanel/task/:id/logs/',isLoggedIn,asyncCatcher(async (req,res,next)=>{
    const task = await Task.findById(req.params.id)

    res.render('logs',{logs:task.logs,title:'logs',message:checkError(req)})
}))
.post('/taskpanel/task/:id/logs/',isLoggedInBTS,asyncCatcher(async (req,res,next)=>{
    await Task.findByIdAndUpdate(req.params.id,{$push:{logs:{log:req.body.log,dateandtime:dateAndTime()}}})
    res.json({})
}))
.post('/taskpanel/task/completed/:id',isLoggedInBTS,asyncCatcher(async (req,res,next)=>{
    await Task.findByIdAndUpdate(req.params.id,{completed:true})
    res.json({})
}))
.post('/taskpanel/task/delete/:id',asyncCatcher(async (req,res,next)=>{
    await Task.findByIdAndDelete(req.params.id)
    res.json({})
}))

ConnectionsRouter.get('/',isLoggedIn,(req,res,next)=>{

    res.render('connections',{title:'connections',message:checkError(req)})
})
.get('/task/:id',isLoggedIn,(req,res,next)=>{
    res.render('task',{title:'assign task',message:checkError(req),userid:req.params.id})
})
.post('/task/:id',isLoggedIn,asyncCatcher(async (req,res,next)=>{
    const task = req.body.task
    const to = await User.findOne({userid:req.params.id})
    task.to  = to._id
    task.from = req.user._id
    const newTask = await new Task(task).save()
    // res.redirect('/taskpanel')
    res.render('taskpanel',{title:'task panel',message:checkError(req)})
}))
.get('/chat/:id',isLoggedIn,(req,res,next)=>{
    res.render('chat',{title:'chat',message:checkError(req),usrid:req.params.id})   
 })
.post('/add',isLoggedInBTS,asyncCatcher(async (req,res,next)=>{
    const userid = req.body.userid
    const user = await User.findOne({userid:userid})
    if(!user._id){
        next(new AppError('User does not exist.','500'))
    }
    const currentUser = req.user
    const result = await User.find({$and : [{_id:currentUser._id},{connections : { $in : [user._id]}}]})
    if(result.length > 0){
        return res.json({err:'Connection already exists'})
    }
    await User.updateOne({_id:currentUser._id},{$push: {connections:user._id}})
    await User.updateOne({_id:user._id},{$push: {connections:currentUser._id}})
    await new Chat({
        users:[user._id,currentUser._id],

    }).save()

    res.json({user})
}))
.post('/getconnections/:id',isLoggedInBTS,asyncCatcher(async (req,res,next)=>{
    const id = req.params.id
    const user = await User.findById(id).populate('connections')
    res.json({connections:user.connections})
}))
.post('/delete/:id',isLoggedInBTS,asyncCatcher(async (req,res,next)=>{

    const user = await User.findOne({userid:req.params.id})
    const currentUser = req.user

    await User.updateOne({_id:currentUser._id},{$pull:{connections:user._id}})
    await User.updateOne({_id:user._id},{$pull:{connections:currentUser._id}})
    res.json({})

}))
.post('/chat/:id',isLoggedInBTS,asyncCatcher(async (req,res,next)=>{
    const userid = req.params.id
    const user = await User.findOne({userid:userid})
    const currentUser = req.user
    const message = req.body.message

    const chat = await Chat.findOne({$and:[{users:{$in:[user._id]}},{users:{$in:[currentUser._id]}}]})
    await Chat.updateOne({_id:chat._id},{$push:{messages:{user:currentUser._id,message,dateandtime:dateAndTime()}}})

    res.json({})
}))
.post('/chat/:id/messages',isLoggedInBTS,asyncCatcher(async (req,res,next)=>{
    const userid = req.params.id
    const user = await User.findOne({userid:userid})
    const currentUser = req.user

    const chat = await Chat.findOne({$and:[{users:{$in:[user._id]}},{users:{$in:[currentUser._id]}}]})
    if(chat.messages)
        return res.json(chat.messages)
    return res.json([])
}))
.post('/chat/:id/count',isLoggedInBTS,asyncCatcher(async (req,res,next)=>{
    const user = await User.findOne({userid:req.params.id})
    const chat = await Chat.findOne({$and: [{users:{$in:[user._id]}},{users:{$in:[req.user._id]}}]})
    res.json({count:chat.messages.length}) 
}))


AccountRouter.get('/login',(req,res,next)=>{
    res.render('login',{title:'login',message:checkError(req)})
})
.get('/signup',(req,res,next)=>{
    res.render('signup',{title:'signup',message:checkError(req)})
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




