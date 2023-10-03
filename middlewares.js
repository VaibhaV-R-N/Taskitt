const AppError = require('./AppError')

const asyncCatcher = (fn)=>{
    return async function(req,res,next){
        await fn(req,res,next).catch(e=>{
            next(new AppError(e.message,'500'))
        })
    }
}

const isLoggedIn = (req,res,next)=>{
    if(!req.user){
        return res.redirect('/account/login')
    }else{
        next()
    }
}

const isLoggedInBTS =(req,res,next)=>{
    if(!req.user){
        return res.json({re:'/account/login'})
    }else{
        next()
    }
}

module.exports = {asyncCatcher,isLoggedIn,isLoggedInBTS}