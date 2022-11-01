
const express = require('express');
const colors = require('colors');
const fa = require('fs')
const path = require('path');
const {readFileSync, writeFileSync} =require('fs')
const {createServer} = require('http');
const {Server} = require('socket.io');



// init  express
const app = express();

app.use(express.static(path.join(__dirname, '')))

//create express server to raw server
const httpServer = createServer(app)

//socket server init
const io = new Server(httpServer)


// create a connection to client 005
io.on('connection', (socket) => {
    console.log(`client connected successfull`.bgGreen.black);

    let latestChat = JSON.parse(readFileSync(path.join(__dirname, 'db/chat.json')).toString())
    io.sockets.emit('latestChat', latestChat)
 
    socket.on("chat", ({name, photo, msg})=> {

        let oldChat = JSON.parse(readFileSync(path.join(__dirname, 'db/chat.json')))
        oldChat.push({name, photo, msg})

        writeFileSync(path.join(__dirname, '/db/chat.json'), JSON.stringify(oldChat))

        let latestChat = JSON.parse(readFileSync(path.join(__dirname, 'db/chat.json')).toString())

        const length = latestChat.length;

        let sender ='';

        if(latestChat.length){
            sender = latestChat[length - 1].name;
        }
        console.log(sender);
        // console.log(latestChat.length);
        
        // send data to so
        io.sockets.emit('latestChat', latestChat, sender)
        
    })
})


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client.html'))
})

// server leisten
httpServer.listen(5050, () => {
    console.log(`server run on port 5050`.bgCyan.green);
})