const WebSocket = require('ws');
const express = require('express');
const cors = require('cors');

const wss = new WebSocket.Server({ port: 8002 });
const app = express();
const jsonParser = express.json();

let users = [
    {
        id: 1,
        username: 'Vanya',
        full_name: 'Ivan Vasiliyvich',
        status: 'online',
        lastSeen: ''
    },
    {
        id: 2,
        username: 'Petya',
        full_name: 'Petr Ignatovich',
        status: 'offline',
        lastSeen: new Date()
    },
    {
        id: 3,
        username: 'Misha',
        full_name: 'Michil Stepanidze',
        status: 'online',
        lastSeen: ''
    },
];

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        console.log(`Received message => ${message}`)
    });

    ws.send(JSON.stringify(users));

    const sendUsers = setInterval(function(){
        changeUsers();
        ws.send(JSON.stringify(users));
    }, 5000, );

    ws.on('close', function close() {
        clearInterval(sendUsers);
        console.log('disconnected');
    });
});

app.use(cors());

app.get('/', function (req, res) {
    res.send(JSON.stringify('What r u looking for here?'));
});

app.get('/users', function (req, res) {
    res.send(JSON.stringify(users));
});

app.get('/users/:userId', function (req, res) {
    const userId = req.params['userId'];
    res.send(JSON.stringify(users.find(user => user.id.toString() === userId)));
});

app.put('/users/:userId', jsonParser, function (req, res) {
    const userId = req.params['userId'];
    const userIdx = users.findIndex(user => user.id.toString() === userId);
    console.log(userId)

    users[userIdx].full_name = req.body.newName;

    res.send(JSON.stringify(users[userIdx]));
});


function changeUsers() {
    users = users.map(user => {
        return {
            id: user.id,
            username: user.username,
            full_name: user.full_name,
            status: user.status === 'online' ? 'offline' : 'online',
            lastSeen: user.lastSeen.length ? '' : new Date()
        }
    });
}

app.listen(8001);
