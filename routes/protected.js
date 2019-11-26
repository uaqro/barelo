const router = require('express').Router()
const books = require('../models/Book')
const user = require('../models/User')
const axios = require('axios')
const { detailGet, ISBNform} = require("../controllers/userControllers")

//VISTA DE TODOS LOS LIBROS
router.get('/index', detailGet)

//DETAIL

router.get('/:id', (req, res)=> {
  const { id } = req.params;
  const selBook = books.findById(id)
  res.render('user/detail', selBook)
})

//CONFIRMATION

router.get('/confirmation', (_, res)=>{
  res.render('user/confirmation')
});

//USER PROFILE

router.get('/profile', (_, res)=> {
  const {id} = req.user = id
  res.render('user/profile', user)
})

//ADD NEW

router.get('/new', (_, res)=> {
  res.render('user/new')
})

router.post('/new/ISBN', ISBNform);

router.post('/new/form', postForm)


module.exports = router;