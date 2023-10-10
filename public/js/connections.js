const chats = document.querySelector('.chats')
const addUser = document.querySelector('.user-add')
const userId = document.querySelector('.user-id')
if(user!=='' && user!==undefined){
    user  = JSON.parse(user)
}else window.location.href = '/account/login'


const Connection  = class{
    constructor(user){
        this.user = user
        this.connectionCont  = document.createElement('div')
        this.connectionCont.classList.add('connection-inner-cont')

        this.usertitle = document.createElement('div')
        this.usertitle.classList.add('user-title-cont')
        this.username   = document.createElement('h3')
        this.userid = document.createElement('h3')
        this.username.innerHTML = user.username
        this.userid.innerHTML = user.userid
        this.usertitle.appendChild(this.username)
        this.usertitle.appendChild(this.userid)

        this.options = document.createElement('div')
        this.options.classList.add('connection-options')
        this.chat = new Image()
        this.chat.src = '/public/assets/comment.png'
        this.task = new  Image()
        this.task.src = '/public/assets/checklist.png'
        this.delete = new Image()
        this.delete.src = '/public/assets/delete(1).png'
        this.options.appendChild(this.chat)
        this.options.appendChild(this.task)
        this.options.appendChild(this.delete)

        this.connectionCont.appendChild(this.usertitle)
        this.connectionCont.appendChild(this.options)

        this.chat.addEventListener('click',e=>{
            window.location.href = `/connections/chat/${user.userid}`
        })

        this.task.addEventListener('click',e=>{
            window.location.href = `/connections/task/${user.userid}`
        })

        this.delete.addEventListener('click', async e=>{
            const result = await fetch(`/connections/delete/${this.user.userid}`,{
                method:'POST',
                headers:{
                    'Accept':'applications/json'
                }
            })
            const resObj = await result.json()
            if(resObj.re){
                window.location.href = resObj.re
                return
            }
            chats.removeChild(this.connectionCont)
        })

        chats.appendChild(this.connectionCont)
    }
}

const initConnections = async ()=>{
    const result = await fetch(`/connections/getconnections/${user._id}`,{

        method:'POST',
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/x-www-form-urlencoded',
        }
    })

    const jsonRes = await result.json()
    if(jsonRes.re){
        window.location.href = jsonRes.re
        return
    }
    if(jsonRes.connections){
        for(let user of jsonRes.connections){
            new Connection(user)
        }
    }
}

initConnections()

addUser.addEventListener('click',async e=>{
    if(userId.value === ''){
        showError('User id cannot be empty')
        return
    }

    const data = new URLSearchParams()
    data.append('userid',userId.value)


    const result = await fetch('/connections/add',{
        method:'POST',
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/x-www-form-urlencoded'
        },
        body:data
    })

    const resObj = await result.json()
    if(resObj.re){
        window.location.href = resObj.re
        return
    }

    if(resObj.err){
        showError(resObj.err)
        return
    }

    const {user} = resObj

    if(!user){
        showError('User does not exists')
        return
    }
    
    new Connection(user)
})