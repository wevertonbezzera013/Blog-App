/* LOADING MODULES */

// Express
const express = require('express');
App.get('/app/:id', doEverythingInOneHugeFunctionWithAsyncBranches);

function checkUserAuth(req, res, next) {
    if (req.session.user) return next();
    return next(new NotAuthorizedError());
}
// Body Parser
const bodyParser = require('body-parser');
// Handlebars
const { engine } = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const Handlebars = require('handlebars');
//Mongoose
const mongoose = require('mongoose');
const db = require('./config/db')
    // Other
const App = express();
const admin = require('./routs/admin');
const path = require('path');
require('./models/Postagens')
const Postagem = mongoose.model('postagens')
    // express-session
const session = require('express-session');
// flash
const flash = require('connect-flash');

require('./models/Categoria')
const Categoria = mongoose.model('categorias')

const usuarios = require('./routs/usuario')

const passport = require('passport')
require('./config/auth')(passport)


// CONFIG

/* session */
App.use(session({
    secret: 'cursodenode',
    resave: true,
    saveUninitialized: true
}));

App.use(passport.initialize());
App.use(passport.session());


App.use(flash());

/* Middleware */
App.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
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
mongoose.connect(db.mongoURI).then(() => {
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
App.get('/postagem/:slug', (req, res) => {
    Postagem.findOne({ slug: req.params.slug }).then(postagem => {
        if (postagem) {
            res.render('postagem/index', { postagem: postagem });
        } else {
            req.flash('error_msg', 'Houve um erro!')
            res.redirect('/')
        }
    }).catch(err => {
        req.flash('error_msg', 'Houve um erro!')
        res.redirect('/')
    })
})

App.get('/', (req, res) => {
    Postagem.find().populate('categoria').sort({ data: 'desc' }).then(postagens => {
        res.render('index', { postagens: postagens });
    }).catch(err => {
        req.flash('error_msg', 'Houve um erro!')
        res.redirect('/404')
    })

});

App.get('/404', (req, res) => {
    res.send("Erro 404");
})

App.get('/categorias', (req, res) => {
    Categoria.find().then((categorias) => {
        res.render('categorias/index', { categorias: categorias })

    }).catch(err => {
        req.flash('error_msg', 'Houve um erro!')
        res.redirect('/')
    })
})

App.get('/categorias/:slug', (req, res) => {
    Categoria.findOne({ slug: req.params.slug }).lean().then((categoria) => {
        if (categoria) {
            Postagem.find({ categoria: categoria._id }).then((postagens) => {
                res.render('categorias/postagens', { postagens: postagens, categoria: categoria })
            }).catch((err) => {
                console.log(err)
                req.flash('error_msg', 'Houve um erro!')
                res.redirect('/')
            })
        } else {
            req.flash('error_msg', 'Essa Categoria não existe!')
            req.redirect('/')
        }

    }).catch((err) => {
        console.log(err)
        req.flash('error_msg', 'Houve um erro!')
        res.redirect('/')
    })
})

App.use('/usuarios', usuarios)

App.use('/admin', admin);

// OTHER
const port = process.env.PORT || 8081
App.listen(port, () => {
    console.log('listening on port: ' + port);
});