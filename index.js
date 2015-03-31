var express = require("express");
var app = express();
var port = 3700;
var usernames = {};
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
		io.sockets.emit('message',data);
	});


	socket.on('adduser',function(username){
		console.log('yeah it working');
		console.log(username);
		socket.username = username;
		usernames[username] = username;
		
		socket.emit('message', {message: 'you have connected'});
		socket.broadcast.emit('message',{message: username +' has connected.'});
		
		io.sockets.emit('updateusers',usernames);

	});




});



