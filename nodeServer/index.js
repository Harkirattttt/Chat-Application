const express = require("express")
const app = express()
const server = app.listen(8000)
const io = require("socket.io")(server, {
    cors: {
        origin: '*',
    }
})

let users = {}

io.on('connection',(socket)=>{
    socket.on('new-user-joined',name=>{
        console.log(socket.id)
        users[socket.id] = name;
        socket.broadcast.emit('user-joined',name)
    })

    socket.on('send',message=>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    })

    socket.on('typing',()=>{
        socket.broadcast.emit("typeRec", users[socket.id])
    })

    socket.on('disconnect',()=>{
        socket.broadcast.emit('left',users[socket.id])
        delete users[socket.id]
    })
})