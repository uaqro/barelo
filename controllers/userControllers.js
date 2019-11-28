const books = require("../models/Book.js");
const user = require("../models/User.js");
const Comment = require("../models/Comment.js");
const axios = require("axios");
require("dotenv").config();

exports.indexGet = async (req, res) => {
  const { place } = req.user;
  const buks = await books.find({
    $and: [
      {
        place: {
          $nearSphere: {
            $geometry: { type: "Point", coordinates: [-99.164629, 19.427936] },
            $maxDistance: 10000
          }
        }
      },
      { picked: false }
    ]
  });
  res.render("user/index", { buks });
};
exports.ISBNform = async (req, res) => {
  const { ISBN10, lng, lat, address } = req.body;
  const { id } = req.user;
  const buuk = await axios.get(
    `https://www.googleapis.com/books/v1/volumes?q=+isbn:${ISBN10}&key=${process.env.g_key}`
  );
  const { secure_url } = req.file;
  const buk = {
    title: buuk.data.items[0].volumeInfo.title,
    description: buuk.data.items[0].volumeInfo.description,
    author: buuk.data.items[0].volumeInfo.authors,
    pages: buuk.data.items[0].volumeInfo.pageCount,
    categories: buuk.data.items[0].volumeInfo.categories,
    pic: buuk.data.items[0].volumeInfo.imageLinks.thumbnail,
    idioma: buuk.data.items[0].volumeInfo.language,
    publisher: buuk.data.items[0].volumeInfo.publisher,
    publishDate: buuk.data.items[0].volumeInfo.publishedDate,
    placePic: secure_url,
    place: {
      address: address,
      coordinates: [lng, lat]
    },
    swapper: id
  };
  const buki = await books.create(buk);
  const usr = await user.findById(id);
  usr.publishedBooks.push(buki._id);
  let credits = usr.publishedBooks.length - usr.pickedBooks.length;
  usr.tokens = credits;
  await usr.save();
  await res.redirect(`/user/${buki._id}/confirm`);
};
exports.confirmBook = async (req, res) => {
  const { id } = req.params;
  const buk = await books.findById(id);
  console.log(buk);
  res.render("user/confirmation", buk);
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
  const { _id } = req.user;
  const bookmodel = await books.findById(id);
  if (!bookmodel.picked) {
    await books.findByIdAndDelete(id);
    await user.findByIdAndUpdate(_id, {
      $pull: { publishedBooks: { $in: id } }
    });
    res.redirect("/user/index");
  } else {
    alert("Picked books cannot be deleted.");
  }
};
exports.delBook = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.body;
  await books.findByIdAndDelete(id);
  await user.findByIdAndUpdate(_id, { $pull: { publishedBooks: { $in: id } } });
  res.redirect("/user/new");
};
exports.pickABook = async (req, res) => {
  const { _id } = req.user;
  const { id } = req.params;
  const usr = await user.findById(_id);
  usr.pickedBooks.push(id);
  let credits = usr.publishedBooks.length - usr.pickedBooks.length;
  usr.tokens = credits;
  await usr.save();
  await books.findByIdAndUpdate(id, { picked: true });
  res.redirect(`/user/${id}/book-details`);
};

//HAY QUE EDITAR ESTO:
exports.seeProfile = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.user;
  const swapper = await user.findById(id).populate("commentsRec");
  await swapper.commentsRec.forEach(e => {
    e.populate("swapperPosting");
    if (e.swapperPosting._id === _id) {
      e.show = true;
    }
  });
  res.render("/user/profile", swapper);
};

// router.get('/:id/delete-comment', deleteComment)
exports.deleteComment = async (req, res) => {
  const { id } = req.params; //id del comentario
  const com = await Comment.findById(id);
  await user.findByIdAndUpdate(com.swapperPosting, {
    $pull: { commentsPost: { $in: id } }
  });
  await user.findByIdAndUpdate(com.swapperRec, {
    $pull: { commentsRec: { $in: id } }
  });
  await Comment.findByIdAndDelete(id);
  res.redirect(`/user/${swapperRec}/profile`);
};
exports.editComment = async (req, res) => {
  const { id } = req.params; //Id del comentario
  const com = await Comment.findById(id);
  res.render("user/edit-comment", com);
};
exports.patchComment = async (req, res) => {
  const { id } = req.params;
  const { body } = req.body;
  await Comment.findByIdAndUpdate(id, { body });
  res.redirect(`/user/${com.swapperRec}/profile`);
};
exports.newComment = async (req, res) => {
  const { _id } = req.user;
  const { id } = req.params;
  const { comment } = req.body;
  const newComment = await Comment.create({
    body: comment,
    swapperPosting: _id,
    swapperRec: id
  });
  const giver = await user.findById(_id);
  const reciever = await user.findById(id);
  giver.commentsPost.push(newComment._id);
  reciever.commentsRec.push(newComment._id);
  await giver.save();
  await reciever.save();
  await res.redirect(`/user/${id}/profile`);
};
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
exports.bookDetails = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.user;
  const showB = true;
  let buk = await books.findById(id).populate("swapper");
  const usr = await user.findById(_id);
  const showA = await usr.pickedBooks.includes(id);
  if (_id === buk.swapper._id) {
    showB = false;
  }
  console.log(buk.swapper);
  res.render("user/detail", { buk, showA, showB });
};
exports.getProfile = async (req, res) => {
  const { id } = req.user;
  const swapper = await user
    .findById(id)
    .populate("pickedBooks publishedBooks");
  res.render("user/ownProfile", swapper);
};

exports.deleteUser = async (req, res) => {
  const { id } = req.user;
  req.logout();
  await user.findByIdAndDelete(id);
  res.redirect("/");
};
exports.editUser = async (req, res) => {
  const { id } = req.user;
  const usr = await user.findById(id);
  res.render("user/updateProfile", usr);
};
exports.patchUser = async (req, res) => {
  const { id } = req.user;
  const { address, lng, lat, email } = req.body;
  const { secure_url } = req.file;
  const updt = {
    place: {
      address,
      coordinates: [lng, lat]
    },
    email,
    photoURL: secure_url
  };
  await user.findByIdAndUpdate(id, updt);
  res.redirect("user/profile");
};
