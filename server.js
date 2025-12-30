const WebSocket = require('ws');

// This starts the server on Port 8080
const wss = new WebSocket.Server({ port: 8080 }, () => {
    console.log("-------------------------------------------");
    console.log("ECU RELAY SERVER IS LIVE");
    console.log("Listening on port: 8080");
    console.log("-------------------------------------------");
});

wss.on('connection', (ws) => {
    console.log("NEW DEVICE CONNECTED");

    ws.on('message', (data) => {
        // Convert the binary data to a readable string for our test
        console.log(`Relaying Data: ${data}`);

        // This sends the data to every OTHER connected device
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    });

    ws.on('close', () => {
        console.log("DEVICE DISCONNECTED");
    });
});