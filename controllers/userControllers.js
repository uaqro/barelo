const books = require("../models/Book.js");
const user = require("../models/User.js");
const Comment = require("../models/Comment.js");
const axios = require("axios");
require("dotenv").config();

exports.indexGet = async (req, res) => {
  const { place } = req.user;
  const buks = await books.find({
    place: {
      $nearSphere: {
        $geometry: {
          type: "Point",
          coordinates: [place.coordinates[0], place.coordinates[1]]
        },
        $maxDistance: 10000
      }
    },
    picked: false
  });
  res.render("user/index", {
    buks
  });
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
  res.render("user/confirmation", buk);
};
exports.getpatchForm = async (req, res) => {
  const { id } = req.params;
  const buk = await books.findById(id);
  res.render("user/updateBook", { buk });
};
exports.patchForm = async (req, res) => {
  const { id } = req.params;
  const { address, lng, lat } = req.body;
  if (req.file) {
    const { secure_url } = req.file;
    const buk = await books.findById(id);
    buk.place.address = address;
    buk.place.cooordinates = [lng, lat];
    buk.picPlace = secure_url;
    await buk.save();
    res.redirect(`/user/${buk._id}/book-details`);
  } else {
    const buk = await books.findById(id);
    buk.place.address = address;
    buk.place.cooordinates = [lng, lat];
    await buk.save();
    res.redirect(`/user/${buk._id}/book-details`);
  }
};
exports.deleteBook = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.user;
  const backURL = req.header("Referer");
  const bookmodel = await books.findById(id);
  await books.findByIdAndDelete(id);
  await user.findByIdAndUpdate(_id, {
    $pull: {
      publishedBooks: {
        $in: id
      }
    }
  });
  res.redirect(backURL);
};
exports.delBook = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.body;
  await books.findByIdAndDelete(id);
  await user.findByIdAndUpdate(_id, {
    $pull: {
      publishedBooks: {
        $in: id
      }
    }
  });
  res.redirect("/user/new");
};
exports.pickABook = async (req, res) => {
  const { _id } = req.user;
  const { id } = req.params;
  const usr = await user.findById(_id);
  const showAlert = false;
  usr.pickedBooks.push(id);
  let credits = usr.publishedBooks.length - usr.pickedBooks.length;
  usr.tokens = credits;
  await usr.save();
  await books.findByIdAndUpdate(id, {
    picked: true
  });
  res.redirect(`/user/${id}/book-details`);
};
exports.bookDetails = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.user;
  let showB = true;
  let showC = false;
  let showEdit = false;
  let buk = await books.findById(id).populate("swapper");
  const usr = await user.findById(_id);
  let showA = await usr.pickedBooks.includes(id);
  if (!showA) {
    if (String(buk.swapper._id) === String(_id)) {
      showA = true;
    }
  }
  if (String(_id) == String(buk.swapper._id)) {
    showB = false;
    showEdit = true;
  }
  if (usr.tokens < 1) {
    showB = false;
    showC = true;
  }
  res.render("user/detail", {
    buk,
    showA,
    showB,
    showC,
    showEdit
  });
};
exports.seeProfile = async (req, res) => {
  let commentsArray = [];
  const { id } = req.params;
  const { _id } = req.user;
  const swapper = await user.findById(id).populate("commentsRec");
  await swapper.commentsRec.forEach(async e => {
    let x = false;
    let cont = await Comment.findById(e);
    let poster = await user.findById(e.swapperPosting);
    if (String(e.swapperPosting) === String(_id)) {
      x = true;
    }
    commentsArray.push({
      content: cont,
      show: x,
      poster
    });
  });
  await res.render("user/otherProfile", {
    swapper,
    commentsArray
  });
};
exports.deleteComment = async (req, res) => {
  const { id } = req.params; //id del comentario
  const com = await Comment.findById(id);
  await user.findByIdAndUpdate(com.swapperPosting, {
    $pull: {
      commentsPost: {
        $in: id
      }
    }
  });
  await user.findByIdAndUpdate(com.swapperRec, {
    $pull: {
      commentsRec: {
        $in: id
      }
    }
  });
  await Comment.findByIdAndDelete(id);
  res.redirect(`/user/${com.swapperRec}/profile`);
};
exports.editComment = async (req, res) => {
  const { id } = req.params;
  const com = await Comment.findById(id);
  res.render("user/editComment", com);
};
exports.patchComment = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  const com = await Comment.findById(id);
  com.body = comment;
  await com.save();
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
exports.getProfile = async (req, res) => {
  const { id } = req.user;
  let commentsArray = [];
  const swapper = await user
    .findById(id)
    .populate("pickedBooks publishedBooks commentsRec");

  await swapper.commentsRec.forEach(async e => {
    let x = false;
    let cont = await Comment.findById(e);
    let poster = await user.findById(e.swapperPosting);
    if (String(e.swapperPosting) === String(id)) {
      x = true;
    }
    await commentsArray.push({
      content: cont,
      show: x,
      poster
    });
  });

  await res.render("user/ownProfile", { swapper, commentsArray });
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
  if (req.file) {
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
    res.redirect("/user/profile");
  } else {
    const updt = {
      place: {
        address,
        coordinates: [lng, lat]
      },
      email
    };
    await user.findByIdAndUpdate(id, updt);
    res.redirect("/user/profile");
  }
};
