const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const socketio = require('socket.io');
const http = require('http');

const routes = require('./routes');

const app = express();
const server = http.Server(app);
const io = socketio(server);

mongoose.connect('mongodb+srv://omnistack:omnistack@omnistack9-xin74.mongodb.net/aircnc?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connectionUsers = {};

io.on('connection', socket => {
  const { user_id } = socket.handshake.query;

  connectionUsers[user_id] = socket.id;
});

app.use((req, res, next) => {
  req.io = io;
  req.connectionUsers = connectionUsers;

  return next();
});

app.use(cors());//set restricted access to the backend application.
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(routes);

server.listen(3333);