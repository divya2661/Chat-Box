window.onload = function()
{
    var messages = [];
    var socket = io.connect('http://localhost:3700');
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");
    var content = document.getElementById("content");
    var name = document.getElementById("name");
    var add_people = document.getElementById("add_people");
    var add = document.getElementById("add");
    var users = document.getElementById("users");
    var  rm = document.getElementById("room");



        socket.on('connect',function(){
        socket.emit('adduser',prompt("what is your name?"));
    });


    socket.on('updateusers', function(data) {

        $(users).empty();
        $.each(data, function(key) {
            
            $(users).append('<div><a href = "#" onclick = "alertuser(\''+key+'\')">' + key + '</a></div>');
        });
    });

    function alertuser(user){
        console.log("I think this should work...");
    }

    socket.on('message',function(data){

        if(data.message)
        {
            messages.push(data);
            var html =  '';
            for (var i = 0; i < messages.length; i++) {
                html += '<b>' + (messages[i].username ? messages[i].username : 'Server') + ': </b>';
                 html += messages[i].message + '<br />';
            }

            content.innerHTML = html;
        }
        else
        {
            console.log("there is a problem.",data);
        }
    });

    socket.on('updateRoom',function(rooms,current_room){

        $(rm).empty();
        $.each(rooms,function(key,value){
            console.log("key is: "+key);
            console.log("value is: "+value);
            if(value==current_room){
                $(rm).append('<div>' + value + '</div>');
            }
            else
            {
                $(rm).append('<div><a href="#" onclick="switchRoom(\''+value+'\')">' + value + '</a></div>');
                console.log("its fine..............");
            }
        });


    });
    function switchRoom(room){
        console.log("its fine..............11111");
        socket.emit('switchRoom', room);
    }


//--------------------------------FUNCTIONS------------------------------------


sendButton.onclick = sendMessage = function(){
        if(name.value == "")
        {
            alert("please type your name!");
        }
        else
        {
            var text = field.value;
           // console.log('lolllllllll' + socket.name);
            socket.emit('send',{message: text,username: name.value});
            field.value = "";
        }
    };

    



    $(document).ready(function() {
        $("#field").keyup(function(e) {
            if(e.keyCode == 13) {
                sendMessage();
            }
        });
    });



}
