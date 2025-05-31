const fs = require('fs');
const path = require('path');
const express = require('express');

const router = express.Router();

router.get('/favicon.ico', (req, res) => {
    res.setHeader('Content-Type', 'image/x-icon');
    // TODO favicon
    fs.createReadStream(path.join(__dirname, '../../../', 'client', 'public', 'favicon.ico')).pipe(res);
});

router.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../', 'client', 'build', '/index.html'));
});

module.exports = router;