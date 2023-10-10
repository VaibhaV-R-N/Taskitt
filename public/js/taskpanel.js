const tasks = document.querySelector('.all-tasks')
const my = document.querySelector('.my')
const others = document.querySelector('.others')


const My = class{
    constructor(task){
        this.task = task
        this.myTaskCont = document.createElement('div')
        this.myTaskCont.classList.add('mytaskcont')
        this.from = document.createElement('h3')
        this.from.innerHTML = this.task.from.username
        this.title = document.createElement('h4')
        this.title.innerHTML = this.task.title
        this.description = document.createElement('p')
        this.description.innerHTML = this.task.description
        this.deadline = document.createElement('h6')
        this.deadline.innerHTML = `deadline : ${this.task.deadline}`
        this.progressLabel = document.createElement('label')
        this.progressLabel.innerHTML = `Task completed ${this.task.progress}%`
        this.progressBar = document.createElement('input')
        this.progressBar.setAttribute('type','range')
        this.progressBar.setAttribute('min',0)
        this.progressBar.setAttribute('max',100)
        this.progressBar.setAttribute('step',1)
        this.progressBar.value = this.task.progress
        this.logLabel = document.createElement('label')
        this.logLabel.innerHTML = 'Task log'
        this.log = document.createElement('textarea')
        this.button = document.createElement('button')
        this.button.innerText = 'write'
        this.viewLogs = document.createElement('button')
        this.viewLogs.innerHTML = 'view logs'


        this.progressBar.addEventListener('input',async(e)=>{
            if(this.progressBar.value === '100'){
                yes.addEventListener('click',async e=>{
                    confirmO.style.display = 'none'
                    confirmP.innerHTML = ''

                    const result = await fetch(`/taskpanel/task/completed/${this.task._id}`,{
                        method:'POST',
                        headers:{
                            'Accept':'application/json'
                        }
                    })

                    const resObj = await result.json()
          
                    if(resObj.re){
                        window.location.href = resObj.re
                        return
                    }
                    tasks.removeChild(this.myTaskCont)
            
                })
                showConfirm('Is task completed?')
                
            }

            const data = new URLSearchParams()
            data.append('progress',this.progressBar.value)
            const result = await fetch(`/taskpanel/update/progress/${this.task._id}`,{
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
         
            this.progressLabel.innerHTML = `Task completed ${resObj.progress}%`
            

        })

        this.button.addEventListener('click',async e=>{
            if(this.log.value===''){
                showError('Cannot submit empty log.')
                return
            }
            const data = new URLSearchParams()
            data.append('log',this.log.value)
            const result = await fetch(`/taskpanel/task/${this.task._id}/logs/`,{
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

            this.log.value = ''
        })
        
        this.viewLogs.addEventListener('click',e=>{
            window.location.href = `/taskpanel/task/${this.task._id}/logs`
        })

        this.myTaskCont.appendChild(this.from)
        this.myTaskCont.appendChild(this.title)
        this.myTaskCont.appendChild(this.description)
        this.myTaskCont.appendChild(this.deadline)
        this.myTaskCont.appendChild(this.progressLabel)
        this.myTaskCont.appendChild(this.progressBar)
        this.myTaskCont.appendChild(this.logLabel)
        this.myTaskCont.appendChild(this.log)
        
        this.myTaskCont.appendChild(this.button)
        this.myTaskCont.appendChild(this.viewLogs)

        tasks.appendChild(this.myTaskCont)
    }
}

const Other = class{
    constructor(task){
        this.task = task
        this.otherTaskCont = document.createElement('div')
        this.otherTaskCont.classList.add('othertaskcont')
        this.to = document.createElement('h3')
        this.to.innerHTML = this.task.to.username
        this.title = document.createElement('h4')
        this.title.innerHTML = this.task.title
        this.description = document.createElement('p')
        this.description.innerHTML = this.task.description
        this.deadline = document.createElement('h5')
        this.deadline.innerHTML = `deadline : ${this.task.deadline}`
        this.delete = document.createElement('img')
        this.progress = document.createElement('label')
        this.progress.innerHTML = `progress ${task.progress}%`
        this.delete.src = '/public/assets/delete(1).png'
        this.viewLogs = document.createElement('button')
        this.viewLogs.innerHTML = 'view logs'

        this.delete.addEventListener('click',async e=>{
            const result = await fetch(`/taskpanel/task/delete/${this.task._id}`,{
                method:'POST',
                headers:{
                    'Accept':'application/json'
                }
            })
            const resObj = await result.json()

            if(resObj.re){
                window.location.href = resObj.re
                return
            }
            tasks.removeChild(this.otherTaskCont)
        })

        this.viewLogs.addEventListener('click',e=>{
            window.location.href = `/taskpanel/task/${this.task._id}/logs`
        })

        this.otherTaskCont.appendChild(this.to)
        this.otherTaskCont.appendChild(this.title)
        this.otherTaskCont.appendChild(this.deadline)
        this.otherTaskCont.appendChild(this.progress)
        this.otherTaskCont.appendChild(this.delete)
        this.otherTaskCont.appendChild(this.viewLogs)

        if(this.task.progress === 100){
            this.progress.innerHTML = 'task completed'
        }

        tasks.appendChild(this.otherTaskCont)
    }
    
}



const fetchMyTasks = async()=>{
    tasks.innerHTML = ''
    my.style.backgroundColor = 'var(--foreground)' 
    others.style.backgroundColor = 'transparent' 

    const result = await fetch('/taskpanel/my',{
        method:'POST',
        headers:{
            'Accept':'application/json'
        }
    })
    const resObj = await result.json()
    if(resObj.re){
        window.location.href = resObj.re
        return
    }

    for(let task of resObj){
        if(!task.completed)
            new My(task)
    }
}

const fetchOthersTask = async()=>{
    tasks.innerHTML = ''
    others.style.backgroundColor = 'var(--foreground)' 
    my.style.backgroundColor = 'transparent'

    const result = await fetch('/taskpanel/other',{
        method:'POST',
        headers:{
            'Accept':'application/json'
        }
    })
    const resObj = await result.json()
    if(resObj.re){
        window.location.href = resObj.re
        return
    }

    for(let task of resObj){
       
            new Other(task)
    }
}


fetchMyTasks()

my.addEventListener('click',async e=>{

    fetchMyTasks()
})

others.addEventListener('click',async e=>{
    fetchOthersTask()
})



