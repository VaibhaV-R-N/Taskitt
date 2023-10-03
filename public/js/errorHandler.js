const outer  = document.querySelector('.err-cont')
const inner  = document.querySelector('.err-msg')

if(message !== 'undefined' && message !== undefined && message !== ''){
    outer.style.display = 'block'
    inner.innerHTML = message
}

const showError = (err)=>{
    outer.style.display = 'block'
    inner.innerHTML = err
}
outer.addEventListener('click',e=>{
    if(getComputedStyle(outer).display === 'block') outer.style.display = 'none'
    inner.innerHTML = ''
})