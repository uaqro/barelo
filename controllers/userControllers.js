const books = require("../models/Book.js");
const user = require("../models/User.js");

// QUERY DETAILS AQUÍ EL QUERY TIENE QUE FILTRAR LA UBICACIÓN POR RADIO
exports.indexGet = (req, res) => {
  const { id, location } = req.user;
  const buks = books
    .find({
      $centerSphere: [
        [location.coordinates.lng, location.coordinates.ltd],
        0.00157
      ]
    })
    .populate("swapper");
  res.render("user/index", buks);
};

// exports post ISBN
exports.ISBNform = async (req, res) => {
  const { ISBN10, lng, lat, address } = req.body;
  const { id } = req.user;
  const buuk = await axios.get(
    `https://www.googleapis.com/books/v1/volumes?q=+isbn:${ISBN10}&key=${g_key}`
  );
  const { secure_url } = req.file;
  const buk = {
    title: buuk.volumeInfo.title,
    description: buuk.volumeInfo.description,
    author: buuk.volumeInfo.authors,
    pages: buuk.volumeInfo.pageCount,
    categories: buuk.volumeInfo.categories,
    pic: buuk.volumeInfo.imageLinks.thumbnail,
    idioma: buuk.volumeInfo.language,
    publisher: buuk.volumeInfo.publisher,
    publishDate: buuk.volumeInfo.publishedDate,
    placePic: secure_url,
    place: {
      address: address,
      coordinates: [lng, lat]
    },
    swapper: id
  };

  const buki = await books.create(buk);
  const user = await user.findOne({ _id: id });
  user.publishedBooks.push(buki._id);
  let credits = user.publishedBooks.length - user.pickedBooks.length;
  user.tokens = credits;
  await user.save();
  res.redirect("/user/confirmation");
};

// exports POST User

exports.postForm = async (req, res) => {
  const { id } = req.user;
  const { secure_url } = req.file;
  const {
    title,
    description,
    author,
    pages,
    categories,
    pic,
    idioma,
    publisher,
    publishedDate,
    address,
    lng,
    lat
  } = req.body;

  const buk = {
    title: title,
    description: description,
    author: author,
    pages: pages,
    categories: categories,
    pic: pic,
    idioma: idioma,
    publisher: publisher,
    publishDate: publishedDate,
    placePic: secure_url,
    place: {
      address: address,
      coordinates: [lng, lat]
    },
    swapper: id
  };

  const buki = await books.create(buk);
  const user = await user.findOne({ _id: id });
  user.publishedBooks.push(buki._id);
  let credits = user.publishedBooks.length - user.pickedBooks.length;
  user.tokens = credits;
  await user.save();
  res.redirect("/user/confirmation");
};
