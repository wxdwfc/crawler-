	

 var  wsServer = 'ws://localhost:8080';
 var websocket = null;
 var dataSet = null;

// 2 minutes interval

// var interval = 2 * 60000;
 var interval = 10 * 1000;

 function tick(){
 	console.log("tick");
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
// 	console.log('Retrieved data from server: ' + evt.data); 
//	remove();
 	dataSet = JSON.parse(evt.data);
 	render(dataSet);

 	//setTimeout(tick,interval);

 }

 function onError(evt) { 
	 console.log('Error occured: ' + evt.data); 
 }


 function init_socket() {

 	 websocket = new WebSocket(wsServer); 
	 websocket.onopen = function (evt) { onOpen(evt) }; 
	 websocket.onclose = function (evt) { onClose(evt) }; 
	 websocket.onmessage = function (evt) { onMessage(evt) }; 
	 websocket.onerror = function (evt) { onError(evt) };

 }
 
 function close_socket() {

 	console.log("communicate done");
 	websocket.close();
 }

