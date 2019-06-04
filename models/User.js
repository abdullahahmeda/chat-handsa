const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uniId: Number,
  name: String,
  chats: {
    type: Array,
    default: []
  },
  messages: {
    type:Array,
    default: []
  }
})

const User = mongoose.model('user', userSchema);
module.exports = User;