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

const  TaskSchema = new Schema({
    from:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
    to:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    deadline:{
        type:String,
        required:true
    },
    logs:[{
        log:String,
        dateandtime:String
    }],
    progress:{
        type:Number,
        default:0
    },
    completed:{
        type:Boolean,
        default:false
    }
})

const User = mongoose.model('User',UserSchema)
const Chat = mongoose.model('Chat',ChatSchema)
const Task = mongoose.model('Task',TaskSchema)

module.exports = {User,Chat,Task}