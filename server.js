exports.Start_server = Start_server;

var http = require('http');
var fs = require('fs');

function Start_server(){
    var server = new http.Server();
    server.listen(8000);

    server.on("request",function(request,response){
        

        var url = require('url').parse(request.url);
        var filename = url.pathname.substring(1);
        var type ;

        if(filename == "") {
            filename = "main.html";
        }
        console.log("server received request " + filename);

        switch(filename.substring(filename.lastIndexOf(".")+1)){
            case "html":
            case "htm":type = "text/html;charset=UTF-8";break;
            case "js" :type = "application/javascript;charset=UTF-8";break;
            case "css":type = "text/css;charset=UTF-8";break;
    
        }
        fs.readFile(filename,function(err,content){
            if(err){
            response.writeHead(404,{
            "Content-Type":"text/plain;charset=UTF-8"});

            response.write(err.message);
            response.end();
        }
        else{
            console.log("write done");
            response.writeHead(200,{
            "Content-Type":type});
            response.write(content);
            response.end();
                   
        }   
        });
    });
}