const Book = require("./models/Booj.js")
const User = require("./models/User.js")


// QUERY DETAILS AQUÍ EL QUERY TIENE QUE FILTRAR LA UBICACIÓN POR RADIO
exports.detailGet = (req, res)=> {
  res.render("user/index")
}
/*
exports.detailGEt = (req, res)=> {
  { id, location} = req.user
  const buks = books.find({ $centerSphere: [ [ location.coordinates.lng , location.coordinates.ltd ],  ] })
  { $centerSphere: [ [ <x>, <y> ], <radius> ] }
  res.render('user/index', buks)
  }
}*/
// exports post ISBN
exports.ISBNform = (req, res)=>{
  const { ISBN10, lng, lat, address } = req.body;
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
    place: {
      address:address,
      coordinates:[lng,lat]
    },
    swapper: id
  }
  books.create(buk)
    .then(buki => user.findByIdAndUpdate(
      id,{ $push: {publishedBooks: buki._id }})
        .then(res.redirect('/user/confirmation') )
        .catch())
    .catch()
  }

// exports POST User

exports.postForm = async (req, res) => {
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
    publishedDate, address, lng, lat} = req.body;

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
    place: {
      address:address,
      coordinates:[lng,lat]
    },
    swapper:id
  }
  
  books.create(buk)
    .then(buki => user.findByIdAndUpdate(
      id,{ $push: {publishedBooks: buki._id }})
        .then(res.redirect('/user/confirmation') )
        .catch())
    .catch()
  }

