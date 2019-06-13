const express = require('express');
const router = express.Router();
const AppController = require('../controllers/AppController');

router.get('/', AppController.index__get);
router.post('/', AppController.index__post);

router.get('/chats/add', AppController.add_chat__get);
router.post('/chats/add', AppController.add_chat__post);

router.get('/chats/:id', AppController.chat__get);

router.get('/search', AppController.search__get);

router.get('/404', AppController.not_found__get);
router.get('*', AppController.not_found__get);

module.exports = router;