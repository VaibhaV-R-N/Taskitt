const dateAndTime = ()=>{
    const date = new Date()
    return `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}            ${date.getHours()}:${date.getMinutes()}`
} 

module.exports = {dateAndTime}