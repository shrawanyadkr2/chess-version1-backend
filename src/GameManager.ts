import { WebSocket } from "ws";
import { Init_GAME, MOVE } from "./messages.js";
import { Game } from "./Game.js";


export class GameManager {

    private games : Game[];
    private pendingUser : WebSocket | null;
    private users : WebSocket[];

    constructor(){
        this.games =[];
        this.pendingUser = null; 
        this.users = []

    }
    addUser(socket:WebSocket){

        this.users.push(socket);
        this.addHandler(socket);

    }
    
    removeUser(socket:WebSocket){
        this.users = this.users.filter(user => user !== socket);
        // stop the game here the user left the rom

    }

    private handleMessage(){

    }
    
    private addHandler(socket:WebSocket){

        socket.on("message",(data)=>{
            const message = JSON.parse(data.toString());

            if(message.type == Init_GAME){
                if(this.pendingUser){
                    //start the game
                    const game = new Game(this.pendingUser,socket)
                    this.games.push(game);
                    this.pendingUser = null;
                }else{
                    this.pendingUser = socket;
                }
            }

            if(message.type === MOVE){
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if(game){
                    game.makeMove(socket,message.payload.move)
                }
            }
        })

    }


}