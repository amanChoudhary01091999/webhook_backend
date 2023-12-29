const http = require('http')
const app = require('./app')
const socketIo = require('socket.io');

const port = process.env.PORT || 3005

const server = http.createServer(app)
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('Client connected');
});

server.listen(port, () => {
    console.log(`server started on port ${port}`)
})


module.exports = io;
