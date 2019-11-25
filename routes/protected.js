const router = require('express').Router()
const books = require('../models/Book')
const user = require('../models/User')
const axios = require('axios')


//VISTA DE TODOS LOS LIBROS
router.get('/index', (_, res)=> {
  const buks = books.find()
  res.render('user/index', buks)
})

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

router.post('/new/ISBN', async (req, res) => {
  const { ISBN10 } = req.body;
  const { id } = req.user;
  const buuk = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=+isbn:${ISBN10}&key=${g_key}`)
  const buk = {
    title:buuk.volumeInfo.title,
    description:buuk.volumeInfo.description,
    author:buuk.volumeInfo.authors,
    pages: buuk.volumeInfo.pageCount,
    categories: buuk.volumeInfo.categories,
    pic: buuk.volumeInfo.imageLinks.thumbnail,
    idioma: buuk.volumeInfo.language,
    publisher: buuk.volumeInfo.publisher,
    publishDate: buuk.volumeInfo.publishedDate,
    swapper: id
  }
  books.create(buk)
    .then(buki => user.findByIdAndUpdate(
      id,{ $push: {publishedBooks: buki._id }})
        .then(res.redirect('/user/confirmation') )
        .catch())
    .catch()
  
})

router.post('/new/form', async (req, res) => {
  const { id } = req.user;
  const {
    title,
    description,
    author,
    pages,
    categories,
    pic,
    idioma,
    publisher,
    publishedDate} = req.body;

  const buk = {
    title:title,
    description:description,
    author:author,
    pages:pages,
    categories:categories,
    pic:pic,
    idioma:idioma,
    publisher:publisher,
    publishDate:publishedDate,
    swapper:id
  }
  
  books.create(buk)
    .then(buki => user.findByIdAndUpdate(
      id,{ $push: {publishedBooks: buki._id }})
        .then(res.redirect('/user/confirmation') )
        .catch())
    .catch()
})

