import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express();
const httpServer = createServer(app);
const sockets = new Server(httpServer);
const port = 3000;

app.use(express.static('public'));

httpServer.listen(port, () => {
    console.clear()
    console.log(`> Server is listening on port: ${port}`);
});

export { sockets }