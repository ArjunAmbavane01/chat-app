import { WebSocketServer,WebSocket } from "ws";

const wss = new WebSocketServer({port:8080});

// interface room {
//     sockets:WebSocket[];
// } 
// const rooms = {};
interface socket {
    room:string;
    socket:WebSocket;
}

let allSockets:socket[] = []

wss.on('connection',(socket)=>{

    socket.on('message',(data)=>{

        const parsedMessage = JSON.parse(data.toString());
        if(parsedMessage.type==='join'){
            allSockets.push({
                room:parsedMessage.payload.roomId,
                socket,
            });
            socket.send(`Welcome to room ${parsedMessage.payload.roomId}`);
        }

        if(parsedMessage.type==='chat'){
            const msg = parsedMessage.payload.message
            // let room:string;
            // for(let i=0;i<allSockets.length;i++){
            //     if(allSockets[i].socket === socket){
            //         room = allSockets[i].room;
            //     }
            // }
            const room = allSockets.find(x=>x.socket === socket)?.room;
            allSockets.forEach(s=>{
                if(s.room === room)
                s.socket.send(msg)
            })
        }
    })

    socket.on('close',()=>{
        allSockets = allSockets.filter(s=>s.socket!=socket);
    }) 
})