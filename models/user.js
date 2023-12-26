export class User{
    constructor(ws , name){
        this.ws = ws;
        this.name = name;
    }

    emitMessage(message){
        this.ws.emit(message);
    }
}