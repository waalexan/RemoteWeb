const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const socketIo = require('socket.io');
const http = require('http');
const { newConnect, acceptConnect, Command, Signal, response } = require('./remote.service');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

app.set('io', io);

const renderPage = async (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
};

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../.dist')));

app.get('*', renderPage);

app.post('/newConnect', newConnect);
app.post('/acceptConnect', acceptConnect);

app.post('/command', Command);
app.post('/signal', Signal);
app.post('/command/response', response);

io.on('connection', (socket) => {
    console.log('Novo cliente conectado');

    socket.on('clientMessage', (message) => {
        console.log('info:', message);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

server.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
