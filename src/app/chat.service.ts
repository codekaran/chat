import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private socket;
  url : string='http://localhost:3001';
  constructor() { }
 //public usersList:any=[];
   

  public createConnection(): void {
    this.socket = io(this.url);
  }

  joinRoom(data){
    this.socket.emit('join',data);
  }

  newUserJoined(){
    let observable = new Observable<{user:string, message : string}>(observer=>{
      this.socket.on('new user joined',(data)=>{
        observer.next(data);
      });
      return()=>{this.socket.disconnect();}
    });
    return observable;
  }

  getUsers(){
    

    let observable = new Observable<any>(observer=>{
      this.socket.on('update users',(data)=>{
        observer.next(data);
        console.log('update users');
        console.log(data);
      });
      return()=>{this.socket.disconnect();}
    });
    return observable;
  }
  

  leaveRoom(data){
    console.log('leave RROOOOOMM');
    this.socket.emit('leave',data);
    
  }

  userLeft(){
    let observable = new Observable<{user:string,message:string}>(observer=>{
      this.socket.on('user left',(data)=>{
        observer.next(data);
      });
      return()=>{this.socket.disconnect();}
    });
    return observable;
  }

  sendMessage(data){

    this.socket.emit('message',data);
  }

  recieveMessage(){
    let observable = new Observable<{user:string,message:string}>(observer=>{
      this.socket.on('new message',(data)=>{
        observer.next(data);
      });
      return()=>{this.socket.disconnect();}
    });
    return observable;
  }

// personal chat


privateJoin(data){
  
  this.socket.emit('private join',data);
}

privatRequestHandler(){
  let observable = new Observable<{user:string, message : string,room:string}>(observer=>{
    this.socket.on('request join',(data)=>{
      observer.next(data);
      console.log(data.room);
    });
    return()=>{this.socket.disconnect();}
  });
  return observable;
}
acceptChatRequest(){

}

}

  

