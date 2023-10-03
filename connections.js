const mongoose = require('mongoose')


const Connect = async ()=>{
    await mongoose.connect('mongodb://127.0.0.1:27017/taskitt',{
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(()=>{
        console.log('MongoDB listening at port 27017...')
    })
}

module.exports = {mongoose, Connect}