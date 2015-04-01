var express = require("express");
var app = express();
var port = 3700;
var usernames = {};
var rooms = ['room1','room2','room3'];
//app.set	('views',__dirname + '/tpl');
//app.set('view engine', "jade");
//app.engine('jade', require('jade').__express);
app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res){
    res.sendfile("page.html");
});

var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection',function(socket){

	socket.emit('message',{message:'welcome to the chat.'});
	
	
	socket.on('send',function(data){
		io.sockets.to(socket.room).emit('message',data);
	});


	socket.on('adduser',function(username){
		console.log('yeah it working');
		console.log(username);
		socket.username = username;
		socket.room = 'room1';
		usernames[username] = username;
		socket.join('room1');		
		socket.emit('message', {message: 'you have connected to room1'});

		socket.broadcast.to('room1').emit('message',{message: username +' has connected.'});
		
		io.sockets.emit('updateusers',usernames);
		io.sockets.emit('updateRoom',rooms,'room1');

	});

	socket.on('switchRoom',function(newroom){
		console.log("its fine..............222");

		socket.leave(socket.room);
		socket.join(newroom);

		socket.emit('message',{message:'you have conected to ' + newroom});
		socket.broadcast.to(newroom).emit('message',{message: socket.username + 'has conected to this room'});
		socket.emit('updateRoom',rooms,newroom);

	})



});



