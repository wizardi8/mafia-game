const path = require('path');
const express = require('express');

const config = require('./config');
const { MongoDB } = require('./MongoDB');

new MongoDB()?.then(() => {
    const app = express();

    app.use(express.json());
    app.use(express.static(path.join(__dirname, '../../', 'client', 'build')));

    const routes = require('./routes');
    app.use(routes);

    console.log('server started');

    app.listen(config.port, () => {
        console.log(`your app is listening to port ${config.port}`);
    });
}).catch((error) => {
    console.log('mongo connection error');
    console.log(error);
});
