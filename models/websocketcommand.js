import { WebSocketRoom } from "./websocketroom.js";

export class WebSocketCommand{
    #commandType = '';
    #arguments= [];
    constructor(data , sharedStorage ){
        let temp = JSON.parse(data);
        if(temp.command){
            this.#commandType = temp.command;
        }

        if(temp.args){
            this.#arguments = temp.args;
        }
        this.storage = sharedStorage;
    }

    parseCommand(){
        switch(this.#commandType){
            case 'register_room':{
                return this.registerRoom();
                break;
            }
            case 'list_rooms':{
                return this.listRooms();
            }
        }
        return null;
    }

    registerRoom(){
        console.log(this.#arguments)
        const roomArg = this.#arguments.find(e => e.name == 'room_name');

        try{
            const rooms = this.sharedStorage.getItem('rooms') || [];
            const room = new WebSocketRoom(roomArg.value , rooms.length)
            rooms.push({'room_name' : roomArg.value , 'room_id': rooms.length});
            this.sharedStorage.setItem('rooms', rooms);
            return rooms;
        }catch(e){
            console.log(e)
            return 'Invalid arguments';
        }

        return null;
        
    }

    listRooms(){
        const rooms = this.sharedStorage.getItem('rooms') || [];
        return rooms;
    }
}