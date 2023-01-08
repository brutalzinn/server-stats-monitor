const express = require('express');
const app = express();
const http = require('http');
const si = require('systeminformation');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use( express.static(__dirname + '/node_modules/chart.js/dist'));

app.set('view engine', 'ejs');


app.get('/', (req, res) => {
app.locals.chatjs = chatjs;
  res.render('pages/index', {
    root: (__dirname + '/public')
  });
});

io.on('connection', (socket) => {
    console.log("connected.")
    socket.on('chat message', (msg) => {
      console.log('message: ' + msg);
    });
    setInterval(function() {
        si.mem().then(data => {
            socket.emit("memory", data);
        })
        si.processes().then(data => {
            socket.emit("processes", data);
        })
        si.dockerInfo().then(data => {
            // console.log("docker", data)
      //      socket.emit("processes", data);
        })
      }, 10000)
});
  

server.listen(3000, () => {
  console.log('listening on *:3000');
});