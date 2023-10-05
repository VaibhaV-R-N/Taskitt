const  {mongoose,Connect} = require('./connections')
const passportLocalMongoose = require('passport-local-mongoose')


const Schema = mongoose.Schema

Connect().catch(e=>{
    console.log(e);
})

const UserSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    userid:{
        type:String
    },
    // chats:[{
    //     user:{
    //         type:mongoose.Types.ObjectId,
    //         ref:'User'
    //     },
    //     history:[{
    //         type:mongoose.Types.ObjectId,
    //         ref:'Chat'
    //     }]
    // }],
    connections:[{
        type:mongoose.Types.ObjectId,
        ref:'User'
    }]
})

UserSchema.plugin(passportLocalMongoose)

const ChatSchema = new Schema({
    users:[{
        type:mongoose.Types.ObjectId,
        ref:'User'
    }],
    messages:[{
        user:{
            type:mongoose.Types.ObjectId,
            ref:'User'
        },
        message:String,
        dateandtime:String
    }]
})

const User = mongoose.model('User',UserSchema)
const Chat = mongoose.model('Chat',ChatSchema)



module.exports = {User,Chat}