const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  body: String,
  sender: {},
  chat: mongoose.Schema.Types.ObjectId,
  sentAt: Date
})

const Message = mongoose.model('message', messageSchema);
module.exports = Message;