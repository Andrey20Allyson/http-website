import express from 'express';
import { networkInterfaces } from 'os';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { colorFormat } from './terminal-colors.js';

function getIpv4() {
    for(let networkInterfaceInfo of Object.values(networkInterfaces()))
        if(networkInterfaceInfo[1].address !== '127.0.0.1') 
            return networkInterfaceInfo[1].address
}

console.clear();
console.log(colorFormat('> [%s] Server is starting...', {text: 'Server Status', color: [7, 32, 40]}));

const app = express();
const httpServer = createServer(app);
const sockets = new Server(httpServer);
const port = 3000;
const hostname = getIpv4()

app.use(express.static('public'));

httpServer.listen(port, hostname, () => {
    const listenningMessage = colorFormat('> [%s] Server now is listening on: %s', {text: 'Server Status', color: [7, 32, 40]}, {text: `\n    > [port] ${port}\n    > [link] http://${hostname}:${port}`, color: [3, 33, 40]});
    console.log(listenningMessage);
});

export { sockets }