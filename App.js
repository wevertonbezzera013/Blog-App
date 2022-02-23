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
const mongoose = require('mongoose');
// Other
const App = express();
const admin = require('./routs/admin');
const path = require('path');
// express-session
const session = require('express-session');
// flash
const flash = require('connect-flash');


// CONFIG

/* session */
App.use(session({
    secret: 'cursodenode',
    resave: true,
    saveUninitialized: true
}));
App.use(flash());

/* Middleware */
App.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
})

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
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/blogapp').then(() => {
    console.log("Conectado ao mongo")
}).catch((err) => {
    console.log("Falhou " + err)
})


/* Public */
App.use(express.static(path.join(__dirname, "/public")))

/* App.use((req, res, next) => {
    console.log("Eu sou um Middleware!")
    next();
}) */

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
    console.log('listening on port: ' + port);
});