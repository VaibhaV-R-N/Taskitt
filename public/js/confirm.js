const confirmO = document.querySelector('.confirm')
const confirmP = document.querySelector('.confirm-p')
const yes = document.querySelector('.yes')
const no = document.querySelector('.no')

confirmO.addEventListener('click',()=>{
    if(getComputedStyle(confirmO).display === 'block'){
        confirmO.style.display = 'none'
    }
})


let yesFunc = undefined

const showConfirm = (msg)=>{
    confirmO.style.display = 'block'
    confirmP.innerHTML = msg
}



no.addEventListener('click',()=>{
    confirmO.style.display = 'none'
    confirmP.innerHTML = ''
})