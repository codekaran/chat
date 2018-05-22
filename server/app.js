var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(http);    

var users =[];
app.use(express.static(path.join(__dirname, 'dist/poject')));

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname+'dist'));
  });

  //socket programming.

io.on('connection',function(socket){
 
   
     console.log("user connected ");



    socket.on('join',function(data){
        
        //join
        
        socket.join(data.room);
        console.log(data.user + 'joined the room : ' +data.room);
        users.push({user:data.user,room:data.room,id:socket.id});
       
        updateUsers(data.room);


        //broadcasting

        socket.broadcast.to(data.room).emit('new user joined',{
            user:data.user,
            message : 'has joined this room',
            room :data.room
        });

    });

    //update function

    function updateUsers(room){
        console.log(users);
        io.in(room).emit('update users',users);
    }

    //delete function

    function deleteUser(data){

        var removeIndex = users.map(function(item){return item.user}).indexOf(data.user);
        console.log(removeIndex);
            users.splice(removeIndex,1);
            console.log("users left");
            console.log(users);
            updateUsers(data.room);
    }


    //Leave

    socket.on('leave',function(data){
        
        
        console.log(data.user + 'Left the room : ' +data.room);
        deleteUser(data);
     
        
        socket.broadcast.to(data.room).emit('user left',{
            user:data.user,
            message : 'has left this room'});
            
            
            

        socket.leave(data.room);
    });

    
    //message



    socket.on('message',function(data){
       
        
        console.log(data.message);
        io.in(data.room).emit('new message',{user:data.user,message:data.message});
    
    
    });



   socket.on('disconnect',function(){
    var removeIndex = users.map(function(item){return item.id}).indexOf(socket.id);
    
    if(users[removeIndex]){
    
        var splicedRoom = users[removeIndex].room;
        var splicedUser = users[removeIndex].user;

        }
    else
    console.log('no user found');

            users.splice(removeIndex,1);
            console.log("users left by browser close");
            console.log(users);

                  updateUsers(splicedRoom);
    
                  socket.broadcast.to(splicedRoom).emit('user left',{
                    user:splicedUser,
                    message : 'has left this room'});
                    

    console.log("disconnected");

});

// private CHAT

socket.on('private join',function(data){

    socket.join(data.sender+data.reciever);

    console.log(`sender joined the room : ${data.sender+data.reciever}`);
    var clientIndex = users.map(function(item){return item.user}).indexOf(data.reciever);
    console.log(data);
    console.log(users[clientIndex].id);   
    
    socket.broadcast.to(users[clientIndex].id).emit('request join',{
        user : data.sender,
        message : "Wants to chat",
        room : data.sender+data.reciever
    });

    
});



});

http.listen(3001,function(){
    console.log('listening on: '+3001);
});