const WebSocket = require("ws");

/* Server port */
const port = 3746;

/* Initialize an http server */
const http_ = require('http');
const server = http_.createServer(function (request, response) {
});

/* Start our server */
server.listen(port, () => {
    console.log(`Server started at port ${server.address().port}.`);
});

/* Initialize the WebSocket server instance */
var wss = new WebSocket.Server({ server });

/* On any connection */
wss.on('connection', (ws) => {
    /* Store the message from client */
    var messageServer = [];
    var factorialResult = 0;

    /* Connection is OK then add an event */
    ws.on('message', (message) => {
        /* Log the received message */
        console.log(`Message received from client: ${message}`);

        /* Parse the message */
        messageServer = JSON.parse(message);

        /* Generate a python process using nodejs child_process module */
        const spawn = require('child_process').spawn;
        const py_process = spawn('python3', ["/home/nikolas/codes/websocket-nodejs-python/server/factorial.py"]);

        /* Send the number to py_process */
        py_process.stdin.write(messageServer.number.toString());

        /* Close the stream */
        py_process.stdin.end();

        /* Define what to do on everytime node application receives data from py_process */
        py_process.stdout.on('data', function(data){
            factorialResult = data.toString();
            //console.log('oi ne');
        });
    
        /* At the end, send the result from py_process computing to client */
        py_process.stdout.on('end', function(){
            //console.log("server fim");
            /* Send the message back to the client */
            ws.send(JSON.stringify({ time: messageServer.time, number: messageServer.number, fact: factorialResult }));
        });

    });
    console.log("Have a connection at port 3746");
});