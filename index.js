const express  =  require('express')
const path = require('path')


const {BaseRouter,AccountRouter,ConnectionsRouter} = require('./router')

const app = express()
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use('/public',express.static(path.join(__dirname,'public')))


app.listen(3000,(e)=>{
    console.log('Listening at port 3000...');
})


app.use('/',BaseRouter)
app.use('/account',AccountRouter)
app.use('/connections',ConnectionsRouter)