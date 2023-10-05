const chatContainer = document.querySelector('.chat-cont-inner')
const textarea = document.querySelector('.message')
const send = document.querySelector('.send')

let messageCount = 0
let prevCount = 0
let chatUser
send.addEventListener('click',async e=>{
    if(textarea.value !== '' && usrid){
        const data = new URLSearchParams()
        data.append('message',textarea.value)
        const result = await fetch(`/connections/chat/${usrid}`,{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/x-www-form-urlencoded'
            },
            body:data
        })

        const {count,chatuser} = await result.json()
        chatUser = chatuser 
        if(count && count !== messageCount){
            prevCount = messageCount
            messageCount = count
           
        }
        textarea.value = ''
    }  
    
})
// 9845624339

const Message = class {
    constructor(message){
        this.message = message
        this.user = message.user
        this.container = document.createElement('div')
        this.paragraph = document.createElement('p')
        this.h4 = document.createElement('h4')
        this.h4.innerHTML = this.message.dateandtime
        if(this.user._id===user._id){
            this.container.classList.add('mychat')
        }else{
            this.container.classList.add('otherchat')
        }
        this.container.innerText = this.message.message
        this.container.appendChild(this.h4)
        chatContainer.appendChild(this.container)
    }
}

const fetchMessages = async()=>{
    const result = await fetch(`/connections/chat/${usrid}/messages`,{
        method:'POST',
        headers:{
            'Accept':'application/json'
        }
    })
    chatContainer.innerHTML =''
    const resObj = await result.json()
    for(let message of resObj){
        new Message(message)
    }

}
fetchMessages()

const refreshMessages = async ()=>{
   
    if(prevCount !== messageCount){
        fetchMessages()
        prevCount = messageCount
    }
}

setInterval(refreshMessages,1000)