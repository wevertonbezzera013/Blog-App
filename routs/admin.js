const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')
require('../models/Postagens')
const Postagem = mongoose.model('postagens')

router.get('/', (req, res) => {
    res.render('admin/index')
})

router.get('/posts', (req, res) => {
    res.send('Página de Posts')
})

router.get('/categorias/add', (req, res) => {
    res.render('admin/addcategorias')
})

router.get('/categorias', (req, res) => {
    Categoria.find().sort({ date: 'desc' }).then((categorias) => {
        res.render('admin/categorias', { categorias: categorias })
    }).catch((error) => {
        req.flash('error_msg', "Houve um erro!")
        res.redirect('/admin')
    })
})

router.post('/categorias/nova', (req, res) => {

    var erros = [];

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: "Nome inválido!" })
    }
    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({ texto: 'Slug inválido!' })
    }
    if (req.body.nome.length < 2) {
        erros.push({ texto: 'Nome da categoria muito pequeno!' })
    }
    if (erros.length > 0) {
        res.render('admin/addcategorias', { erros: erros })
    } else {
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }

        new Categoria(novaCategoria).save().then(() => {
            req.flash('success_msg', 'categoria saved')
            res.redirect('/admin/categorias')
        }).catch((err) => {
            req.flash('error_msg', 'Error saving categoria')
            console.log('Erro: ' + err)
            res.redirect('/admin')
        })
    }
})

router.get('/categorias/edit/:id', (req, res) => {
    Categoria.findOne({ _id: req.params.id }).then((categoria) => {
        res.render('admin/editcategorias', { categoria: categoria })
    }).catch((err) => {
        req.flash('error_msg', 'Essa categoria não existe!')
        res.redirect('/admin/categorias')
    })

})

router.post('/categorias/edit', (req, res) => {
    Categoria.findOne({ _id: req.body.id }).then((categoria) => {

        categoria.nome = req.body.nome;
        categoria.slug = req.body.slug;

        categoria.save().then(() => {
            req.flash('succsess_msg', 'Categoria editada com sucesso!')
            res.redirect('/admin/categorias')
        }).catch((err) => {
            req.flash('error_msg', "Houve um erro!")
            res.redirect('/admin/categorias')
        });

    }).catch((err) => {
        req.flash('error_msg', "Houve um erro!")
        res.redirect('/admin/categorias')
    })
})

router.post('/categorias/deletar', (req, res) => {
    Categoria.remove({ _id: req.body.id }).then(() => {
        req.flash('succsess_msg', 'Categoria editada com sucesso!')
        res.redirect('/admin/categorias')
    }).catch((err) => {
        req.flash('error_msg', "Houve um erro!")
        res.redirect('/admin/categorias')
    })
})

router.get("/postagens", (req, res) => {

    Postagem.find().lean().populate("categoria").sort({ data: "desc" }).then((postagens) => {

        res.render("admin/postagens", { postagens: postagens })

    }).catch((err) => {

        req.flash("error_msg", "Houve um erro ao listar as postagens")

        res.redirect("/admin")

    })
})

router.get('/postagens/add', (req, res) => {
    Categoria.find().then((categorias) => {
        res.render('admin/addpostagem', { categorias: categorias })
    }).catch((err) => {
        req.flash('error_msg', "Houve um erro!")
        res.redirect('/admin')
    })
})

router.post('/postagens/nova', (req, res) => {

    var erros = []

    if (req.body.categoria == '0') {
        erros.push({ text: 'Categoria inválida' })
    }

    if (erros.length > 0) {
        res.render('admin/postagem', { erros: erros })
    } else {
        const novaPostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            slug: req.body.slug,
            categoria: req.body.categoria
        }

        new Postagem(novaPostagem).save().then(() => {
            req.flash('success_msg', 'Postagem criada')
            res.redirect('/admin/postagens')
        }).catch((err) => {
            req.flash('error_msg', "Houve um erro!")
            res.redirect('/admin/postagens')
        })
    }

})

module.exports = router;