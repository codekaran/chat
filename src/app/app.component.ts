import { Component, OnInit} from '@angular/core';

import { ChatService } from './chat.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  user : string;
  room :string;
  gotUser: boolean=false;
  title = 'app';
  msg : string="";
  messageArray:Array<{user:string,message:string}> = [];
  userArray:any=[];
  personalChat:boolean=false;
  chatCount:number=0;
  personalChatter:string[]=[];
  privateChatRequest:boolean=false;
  sender:string="";

constructor(private chatService : ChatService){}

ngOnInit(){
    this.createConnenction();
    this.chatService.newUserJoined()
      .subscribe(data=>{this.messageArray.push(data);
      });

      this.chatService.getUsers()
        .subscribe(data=>{this.userArray=data;
        console.log(this.userArray);
      });

    this.chatService.userLeft()
      .subscribe(data=>this.messageArray.push(data));

    this.chatService.recieveMessage()
      .subscribe(data=>this.messageArray.push(data));

      //personal chat


      this.chatService.privatRequestHandler()
        .subscribe(data=>{
         this.requestUser(data);
        });
}


createConnenction():void{
  this.chatService.createConnection();
}

getUser(user:string){
  this.user = user;
  console.log(this.user);
}
getRoom(room:string){
  this.room  = room;
  console.log(this.room);
}
dataRecieved(){
  if(this.user && this.room){

       this.gotUser = true;
      //  this.chatService.getUsers();
  }
  else
  this.gotUser=false;
}




join():void{
  if(this.gotUser==true)
  this.chatService.joinRoom({user:this.user,room:this.room});
}

leave():void{
  this.chatService.leaveRoom({user:this.user,room:this.room});
}






getMsg(msg : string){
  this.msg = msg;

}

sendMessage():void{
  this.chatService.sendMessage({user:this.user,room:this.room,message:this.msg});
  
}

//personal chat


privateChat(chatUser:string):void{
   this.personalChat=true;
   this.personalChatter[this.chatCount]=chatUser;
   console.log("personal");
   console.log(this.personalChatter);
   this.chatCount++;

  this.chatService.privateJoin({sender:this.user,reciever:chatUser});
   
}

requestUser(data){
    this.sender = data.user;
    
    this.privateChatRequest=true;
    document.getElementById('modalClick').click();
  
}

acceptChatRequest(){
  this.chatService.acceptChatRequest();
}

}

