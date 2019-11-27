const books = require("../models/Book.js");
const user = require("../models/User.js");

// QUERY DETAILS AQUÍ EL QUERY TIENE QUE FILTRAR LA UBICACIÓN POR RADIO
exports.indexGet = (req, res) => {
  const { place } = req.user;
  const buks = books
    .find({
      $and: [
        {
          $centerSphere: [
            [place.coordinates.lng, place.coordinates.ltd],
            0.00157
          ]
        },
        { picked: false }
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

exports.getpatchForm = async (req, res) => {
  const { id } = req.params;
  const buk = await books.findOne({ _id: id });
  res.render("user/patch");
};

exports.patchForm = async (req, res) => {
  const { id } = req.params;
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
  const buk = await books.findOneAndUpdate(
    { _id: id },
    {
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
      }
    }
  );
  res.redirect("/user/index");
};

exports.deleteBook = async (req, res) => {
  const { id } = req.params;
  const { u_id } = req.body;
  const bookmodel = await books.findById(id);
  if (!bookmodel.picked) {
    books.findByIdAndDelete({ _id: id });
    user.findByIdAndUpdate(u_id, { $pull: { publishedBooks: { $in: id } } });
  } else {
    alert("Picked books cannot be deleted.");
  }
};

exports.pickABook = async (req, res) => {
  const { _id } = req.user;
  const { id } = req.params;
  const user = await user.findOne({ _id: _id });
  user.pickedBooks.push(id);
  let credits = user.publishedBooks.length - user.pickedBooks.length;
  user.tokens = credits;
  await user.save();
  await books.findByIdAndUpdate(id, { picked: true });
  req.app.locals.id.pickedBook = true;
  res.redirect(`/${id}`);
};
