var socket = io();
var chatField       = document.querySelector('.chat-message-box__field'),
    sendButton      = document.getElementById('chat-message-box__button'),
    chatMessages    = document.querySelector('.chat-messages');


if(sendButton) {
  chatField.onkeyup = function() {
    if(chatField.value.length > 0) {
        var x =  new RegExp("[\x00-\x80]+"); // is ascii

        var isAscii = x.test(chatField.value);

        if(isAscii) {
          chatField.style.direction = "ltr"
        } else {
          chatField.style.direction = "rtl"
        }
    }
  };
  document.querySelector('.chat-message-box').addEventListener('submit', (e) => {
    e.preventDefault();
    if(validator.escape(chatField.value.trim()) !=  '') {
      socket.emit('new message', {
        msg: chatField.value,
        chatId: window.location.pathname.substr(7)
      });
      var chatMessageWrapper = document.createElement('div'),
        liMessage = document.createElement('li'),
        pMessage = document.createElement('p');
        chatMessageWrapper.classList.add('chat-messages__message-wrapper')
        chatMessageWrapper.classList.add('flex')
        liMessage.classList.add('chat-messages__message');
        pMessage.classList.add('chat-messages__info');
        liMessage.textContent = chatField.value;
        pMessage.textContent = 'تم الارسال الآن بواسطتك';
        chatMessageWrapper.appendChild(liMessage);
        chatMessageWrapper.appendChild(pMessage);
        chatMessages.appendChild(chatMessageWrapper)
        let MessagesLength = +document.querySelector('#messages-span').textContent;
        MessagesLength += 1;
        document.querySelector('#messages-span').textContent = MessagesLength;
      chatField.value = '';
      return false;
    }
  })
}

socket.on('new message',({msg, sender}) => {
  var chatMessageWrapper = document.createElement('div'),
        liMessage = document.createElement('li'),
        pMessage = document.createElement('p');
        chatMessageWrapper.classList.add('chat-messages__message-wrapper')
        chatMessageWrapper.classList.add('chat-messages__message-wrapper--other')
        chatMessageWrapper.classList.add('flex')
        liMessage.classList.add('chat-messages__message');
        pMessage.classList.add('chat-messages__info');
        liMessage.textContent = msg;
        pMessage.textContent = 'تم الارسال الآن بواسطة ' + sender;
        chatMessageWrapper.appendChild(liMessage);
        chatMessageWrapper.appendChild(pMessage);
        chatMessages.appendChild(chatMessageWrapper)
        let MessagesLength = +document.querySelector('#messages-span').textContent;
        MessagesLength += 1;
        document.querySelector('#messages-span').textContent = MessagesLength;
})


var joinChatButton = document.querySelector('.join-chat-btn');
if(joinChatButton) {
  joinChatButton.addEventListener('click', () => {
    socket.emit('new user', {
      chatId: window.location.pathname.substr(7), 
      password: document.querySelector('.join-chat-field').value
    });
    return false;
  })
}

socket.on('new user success', (name) => {
  var newUser = document.createElement('li');
  newUser.classList.add('chat-messages__new-user');
  newUser.textContent = 'انضم ' + name + ' للشات';
  chatMessages.appendChild(newUser);
  let UsersLength = +document.querySelector('#users-span').textContent;
    UsersLength += 1;
    document.querySelector('#users-span').textContent = UsersLength;
});

socket.on('new user fail', () => {
  if(document.querySelector('.join-chat-error')) {
    document.querySelector('.join-chat-error').style.display = "block";
  }
})