const http = require('http');
const WebSocket = require('ws');

// 1. DYNAMIC PORT LOGIC
// Render gives us a port via 'process.env.PORT'. If it's missing (like on your PC), it uses 8080.
const PORT = process.env.PORT || 8080;

// 2. CREATE THE BASE SERVER
// This handles the "Health Check" that Render performs to see if your app is alive.
const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end("ECU Relay Server is Running!");
});

// 3. ATTACH WEBSOCKET TO THE SERVER
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log("DEVICE CONNECTED TO RELAY");

    ws.on('message', (data) => {
        console.log(`Relaying Data: ${data}`);

        // Broadcast to all other connected clients
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    });

    ws.on('close', () => console.log("DEVICE DISCONNECTED"));
});

// 4. START THE SERVER
// '0.0.0.0' tells the server to listen for external traffic, not just local.
server.listen(PORT, '0.0.0.0', () => {
    console.log("-------------------------------------------");
    console.log(`REMOTE ECU RELAY LIVE ON PORT: ${PORT}`);
    console.log("-------------------------------------------");
});