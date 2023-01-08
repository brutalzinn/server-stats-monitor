const express = require('express');
const app = express();
const http = require('http');
const si = require('systeminformation');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.set('view engine', 'ejs');

app.use( express.static(__dirname + '/node_modules/chart.js'));

const statsData = 
{
  labels:[],
  memory:{
    total: 0,
    available: 0,
    data:[]
  },
  cpu:[]

}

app.get('/', (req, res) => {
  res.render('pages/index')
});

io.on('connection', (socket) => {
    console.log("connected.")
    socket.on('chat message', (msg) => {
      console.log('message: ' + msg);
    });
     
    setInterval(function() {
        si.mem().then(data => {
            statsData.memory.total = data.total
            statsData.memory.available = data.available
            statsData.memory.data.push({x: new Date(), y: data.used })
        })
        // si.currentLoad().then(data => {
        //     statsData.cpu.push({x: date.toLocaleString(), y: data.currentLoad })
        // })
        socket.emit("stats_memory", statsData);
      }, 10000)
});
  

server.listen(3000, () => {
  console.log('listening on *:3000');
});