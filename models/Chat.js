const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  name: String,
  password: String,
  users: {
    type: [mongoose.Schema.Types.ObjectId],
    default: []
  },
  messages: {
    type: Array,
    default: []
  }
})

chatSchema.index({ name: 'text'});

const Chat = mongoose.model('chat', chatSchema);
module.exports = Chat;