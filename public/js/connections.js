const chats = document.querySelector('.chats')
const addUser = document.querySelector('.user-add')
const userId = document.querySelector('.user-id')


const Connection  = class{
    constructor(user){
        this.user = user
        this.connectionCont  = document.createElement('div')
        this.h3 = document.createElement('h3')
        this.options = document.createElement('div')
        this.chat = new Image()
        this.chat.src = '/public/assets/comment.png'
        this.task = new  Image()
        this.task.src = '/public/assets/checklist.png'
        this.delete = new Image()
        this.delete.src = '/public/assets/delete(1).png'
        this.options.appendChild(this.chat)
        this.options.appendChild(this.task)
        this.options.appendChild(this.delete)
        this.connectionCont.appendChild(this.h3)
        this.connectionCont.appendChild(this.options)

        this.chat.addEventListener('click',e=>{

        })

        this.task.addEventListener('click',e=>{
            
        })

        this.delete.addEventListener('click',e=>{
            
        })

        chats.appendChild(this.connectionCont)
    }
}

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

    const {user} = resObj
    
})