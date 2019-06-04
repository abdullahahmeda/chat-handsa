const express       = require('express'),
      path          = require('path'),
      mongoose      = require('mongoose'),
      bodyParser    = require('body-parser'),
      session       = require('express-session')({
        secret: 'sessionpasskey',
        resave: true,
        saveUninitialized: false
      }),
      sharedSession = require('express-socket.io-session')
      

const app = express();
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT);
const io = require('socket.io').listen(server);

const appRouter = require('./routes/app');

app.use(bodyParser.urlencoded({ extended: false }))

app.use(session)
io.use(sharedSession(session, {
  autoSave:true
})); 


app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
})

const DBConnectionURL = 'mongodb://elmagicabdulah:2962000a@ds231537.mlab.com:31537/chat-handsa-db'

mongoose.connect(DBConnectionURL, {useNewUrlParser: true})

app.use('/', appRouter);

const Message = require('./models/Message'),
    User    = require('./models/User'),
    Chat    = require('./models/Chat');


io.on('connection', (socket) => {
    socket.on('new message', ({msg, chatId}) => {
        msg = msg;
        if(msg && chatId && socket.handshake.session.name && socket.handshake.session.name.length > 0) {
            let sender = socket.handshake.session.name;
            Message.create({
                body: msg,
                chat: chatId,
                sender: {_id: socket.handshake.session.user, name: socket.handshake.session.name},
                sentAt: Date.now()
            }).then((record) => {
                User.updateOne({_id: socket.handshake.session.user}, { $push: {messages: record._id} }).then(() => {
                    Chat.updateOne({_id: chatId}, { $push: {messages: record._id} }).then(() => {
                        socket.broadcast.emit('new message', {msg, sender})
                    })
                })
            })
        }
    })

    socket.on('new user', (chatId) => {
        Chat.updateOne({_id: chatId}, {$push: {users: socket.handshake.session.user}}).then(() => {
            User.update({_id: socket.handshake.session.user}, { $push: {chats: chatId}}).then(() => {
                io.emit('new user success', socket.handshake.session.name);
            }).catch(() => {
                io.emit('new user fail');
            })
        }).catch(() => {
            io.emit('new user fail');
        })
    })
})

