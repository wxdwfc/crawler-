	

 var  wsServer = 'ws://localhost:8080';
 var websocket = null;
 var dataSet = null;

 function tick(){

 	if(websocket != null){
 		websocket.send("hello");
 	}
 }

 
 function onOpen(evt) { 
 	console.log("Connected to WebSocket server."); 
 	tick();
 } 

 function onClose(evt) { 
 	console.log("Disconnected"); 
 } 

 function onMessage(evt) { 
 	console.log('Retrieved data from server: ' + evt.data); 
 	dataSet = JSON.parse(evt.data);
 	render(dataSet);

 }

 function onError(evt) { 
	 console.log('Error occured: ' + evt.data); 
 }


 function init() {

 	 websocket = new WebSocket(wsServer); 
	 websocket.onopen = function (evt) { onOpen(evt) }; 
	 websocket.onclose = function (evt) { onClose(evt) }; 
	 websocket.onmessage = function (evt) { onMessage(evt) }; 
	 websocket.onerror = function (evt) { onError(evt) };

 }

