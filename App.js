/* LOADING MODULES */

// Express
const express = require('express');
// Body Parser
const bodyParser = require('body-parser');
// Handlebars
const { engine } = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const Handlebars = require('handlebars');
//Mongoose
/* const mongoose = require('mongoose'); */
// Other
const App = express();
const admin = require('./routs/admin');
const path = require('path');

// CONFIG
/* Body Parser */
App.use(bodyParser.urlencoded({ extended: true }));
App.use(bodyParser.json());

/* Handlebars */
App.engine('handlebars', engine({
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
App.set('view engine', 'handlebars');
App.set("views", "./views");

/* Mongoose */

/* Public */
App.use(express.static(path.join(__dirname, '/public')));

// ROUTS
App.get('/', (req, res) => {
    res.send('Rota principal');
});

App.get('/posts', (req, res) => {
    res.send('Rota de Posts');
});

App.use('/admin', admin);

// OTHER
const port = 8081
App.listen(port, () => {
    console.log('listening on port' + port);
});