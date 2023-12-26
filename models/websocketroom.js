import { SharedStorage } from "./storage.js";
import { WebSocketUser } from "./websocketuser.js";
const defaultStorage = new SharedStorage();
const MAX_USERS = 2;
export class WebSocketRoom{
    /***
     * @type {WebSocketUser[]} - A list of users in the room
     */
    users  = [] ;
    /***
     * @param {string} name - Name of room
     * @param {string} id - ID of room 
     * @param {SharedStorage} storage  - A common storage to retrieve items from
     */
    constructor(name, id, storage = defaultStorage){
        this.name = name;
        this.id = id;
        this.storage = storage;
    }

    /**
     * 
     * @param {WebSocketUser} user 
     */
    join(user){
        /**@type {WebSocketUser[]} */
        if(this.users?.length >= 2){
            throw new Error(`Room ${this.name} is full`);
        }
        for(const curUser of this.users){
            // #TODO - Once user is ready emit to that client the appearence of a new user
            curUser.ws.emit({
                'user_joined' : {username : user.username , id: user.id},
            })
        }
        this.users.push(user);
        this.updateStorageRooms();
    }

    /**
     * Disconnect a user from the current room
     * @param {WebSocketUser} user 
     */
    disconnect(user){
        /** @type {WebSocketUser[]} */
        const users = this.users;
        this.users = users.filter(e =>  e.id != user.id); // #TODO - Change filter logic once User class is implemented
        this.storage.setItem('users' , users);
        for(const curUser of users){
            curUser.ws.emit({
                'user_exited' : {username : user.username , id: user.id},
            })
        }
        this.updateStorageRooms();
    }

    updateStorageRooms(){
        const rooms = this.storage.getItem('rooms' , []);
        const existingRoom = rooms?.find(e => e.id == this.id);
        if(!existingRoom) return;
        existingRoom.users = this.users;
        this.storage.setItem('rooms' , rooms);
    }
}