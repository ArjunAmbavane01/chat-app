"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let allSockets = [];
wss.on('connection', (socket) => {
    socket.on('message', (data) => {
        var _a;
        const parsedMessage = JSON.parse(data.toString());
        if (parsedMessage.type === 'join') {
            allSockets.push({
                room: parsedMessage.payload.roomId,
                socket,
            });
            socket.send(`Welcome to room ${parsedMessage.payload.roomId}`);
        }
        if (parsedMessage.type === 'chat') {
            const msg = parsedMessage.payload.message;
            // let room:string;
            // for(let i=0;i<allSockets.length;i++){
            //     if(allSockets[i].socket === socket){
            //         room = allSockets[i].room;
            //     }
            // }
            const room = (_a = allSockets.find(x => x.socket === socket)) === null || _a === void 0 ? void 0 : _a.room;
            allSockets.forEach(s => {
                if (s.room === room)
                    s.socket.send(msg);
            });
        }
    });
    socket.on('close', () => {
        allSockets = allSockets.filter(s => s.socket != socket);
    });
});
