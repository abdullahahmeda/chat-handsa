const validator = require('validator');

const User    = require('../models/User'),
      Chat    = require('../models/Chat'),
      Message = require('../models/Message');

const englishRegex = /^[A-Za-z0-9 ]*$/;

exports.index__get = (req, res) => {
  if(req.session.name && req.session.name.length > 0) {
    User.find({_id: req.session.user}).then(user => {
      Chat.find({_id: user[0].chats}).then(chats => {
        return res.render('index', {
          errorText: undefined,
          chats
        })
      })
    })
  } else {
    return res.render('index');
  }
}

exports.index__post = (req, res) => {
  const uniId = validator.escape(req.body.uniId);
  if(validator.isInt(uniId)) {
    User.find({uniId}).then(user => {
      
      if(user.length > 0) {
        req.session.user = user[0]._id;
        req.session.name = user[0].name;
        return res.redirect(302, '/')
      } else {
        return res.render('index', {
          errorText: 'الرقم الجامعي ده مش صح'
        })
      }
    })
  } else {
    return res.render('index', {
      errorText: 'من فضلك يا باشمهندس/ة اكتب/ي رقمك الجامعي'
    })
  }
}

exports.add_chat__get = (req, res) => {
  if(req.session.name && req.session.name.length > 0) {
    return res.render('add_chat', {
      errorText: undefined
    })
  } else {
    return res.redirect(302, '/')
  }
}

exports.add_chat__post = (req, res) => {
  if(req.session.name && req.session.name.length > 0) {
    const chatName     = validator.escape(req.body.chat_name),
          chatPassword = validator.escape(req.body.chat_password);

    if(englishRegex.test(chatName) && chatName != '') {
      Chat.create({
        name: chatName,
        password: chatPassword,
        users: [req.session.user]
      }).then((record) => {
        User.updateOne({_id: req.session.user}, { $push: {chats: record._id} }).then(() => {
          return res.redirect(302, '/');
        });
      })
      
    } else {
      return res.render('add_chat', {
        errorText: 'من فضلك ادخل اسم الشات حروف انجليزية فقط'
      })
    }
    
  } else {
    return res.redirect(302, '/')
  }
}

exports.chat__get = (req, res) => {
  if(req.session.name && req.session.name.length > 0) {
    const chatId = req.params.id;
    Chat.find({_id: chatId}).then(chat => {
      if(chat.length > 0) {
        // Check if user is enrolled in this chat
        if(chat[0].users.indexOf(req.session.user) != -1) {
          // Get messages
          Message.find({ _id: chat[0].messages}).then((messages) => {
            return res.render('chat', {
              chat: chat[0],
              messages,
              hasAccess: true
            })
          });
        } else {
          return res.render('chat', {
            chat: chat[0],
            hasAccess: false
          })
        }
      } else {
        return res.redirect(302, '/404');
      }
    }).catch(() => {
      return res.redirect(302, '/404');
    })
  } else {
    return res.redirect(302, '/')
  }
}

exports.search__get = (req, res) => {
  if(req.session.name && req.session.name.length > 0) {
    const query = validator.trim(validator.escape(req.query.query));
    if(query.length > 0) {
      Chat.find({ $text: {$search: query}}).then(chats => {
        if(chats.length > 0) {
          return res.render('search', {
            chats
          })
        } else {
          return res.render('search', {
            chats: undefined
          })
        }
      })
    } else {
      return res.redirect(302, '/')
    }
  } else {
    return res.redirect(302, '/')
  }
  
}


exports.not_found__get = (req, res) => {
  return res.render('404');
}