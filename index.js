import { WebSocketServer } from 'ws';
import { WebSocketCommand } from './models/websocketcommand.js';
import { SharedStorage } from './models/storage.js';
import { WebSocketUser } from './models/websocketuser.js';
const storage = new SharedStorage();
const wss = new WebSocketServer({ port: 8080 });



wss.on('connection', function connection(ws , req) {
    const clientId = req.headers['sec-websocket-key']; 
    ws.send(JSON.stringify({clientId}));
    ws.id = clientId;
    const user = new WebSocketUser(ws,'')
    const users = storage.getItem('users',[]);
    for(const client of users){
        client.send(JSON.stringify({
            header: 'New user connected',
            message: `New client ${client.id} connected`
        }))
    }
    users.push(ws);
    storage.setItem('users', users);
    ws.on('message', function message(data) {
        const parsed = data.toString().includes('command')  ? JSON.parse(data) : {command: ''};
        if(!parsed.command){
            ws.send("invalid payload received");
        }else{
            let command = new WebSocketCommand(data , storage);
            console.log(command.parseCommand());
            ws.send(`Executing command: [${parsed.command}]`)
        }
    });
    ws.on('disconnect' , function disconnect(e){
        console.log('Disconnected :', ws.id)
    })

    ws.on('close',(e)=>{
        console.log('Disconnected :', ws.id);
    })
});
