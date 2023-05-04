const socket = io("http://localhost:8000")

let form = document.getElementById("msgForm")
let container = document.querySelector('.container')
let msgContainer = document.querySelector('.msgCont')
let msgInp = document.getElementById("msgInp")
let typeCont = document.querySelector(".typeCont")

const name = prompt("Enter Your Name: ");

let append = (message,position)=>{
    let messageEle = document.createElement('div')
    messageEle.classList.add('message')
    messageEle.classList.add(position)
    if(position=='left')
    {
        messageEle.innerHTML = `${message}`
    }
    else if(position=='right'){
        messageEle.innerHTML = `<b>You : </b> ${message}`
    }
    else{
        messageEle.innerHTML = `${message}`
    }
    msgContainer.append(messageEle)
    msgContainer.scrollTop = msgContainer.scrollHeight
}

form.addEventListener('submit',(e)=>{
    e.preventDefault()
    let message = msgInp.value;
    if(message!='')
    {
        msgInp.value = ''
        append(message,'right')
        socket.emit('send', message)
    }
})

msgInp.addEventListener("input",()=>{
    socket.emit('typing');
})

socket.on("typeRec",(name)=>{
    typeCont.innerHTML = `<p id="typing" >${name} is typing... </p>`
    setTimeout(() => {
        typeCont.innerHTML= ""
    }, 2000);
})

socket.emit('new-user-joined',name)

socket.on('user-joined',(name)=>{
    append(`<b>${name}</b> has joined the chat.`,'middle')
})

socket.on('receive',data=>{
    append(`<b> ${data.name} : </b> ${data.message}`,'left')
})

socket.on('left',(name)=>{
    append(`<b>${name}</b> has left the chat.`,'middle')
})