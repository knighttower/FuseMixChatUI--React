// server.js
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 5000 });

wss.on('connection', (ws) => {
    console.log('Client connected');

    // Send a welcome message
    ws.send(JSON.stringify({ type: 'welcome', timestamp: Date.now() }));

    ws.on('message', (msg) => {
        const text = msg.toString();
        console.log('Received from client:', text);
        // Echo it back
        ws.send(text);
    });

    ws.on('close', () => console.log('Client disconnected'));
});
