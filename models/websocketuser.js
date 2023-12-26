export class WebSocketUser{
    /**
     * WebSocketUser
     * @param {WebSocket} ws 
     * @param {string} username 
     */
    constructor(
        ws , username
    ){
        this.username = username;
        this.ws = ws;
        this.id = ws.id;
    }
}