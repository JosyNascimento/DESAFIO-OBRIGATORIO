const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');

router.get('/', (req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

module.exports = router;