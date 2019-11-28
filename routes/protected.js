const router = require("express").Router();
const books = require("../models/Book");
const user = require("../models/User");
const axios = require("axios");
const uploadCloud = require("../config/cloudinary");
const {
  indexGet,
  ISBNform,
  postForm,
  getpatchForm,
  patchForm,
  deleteBook,
  pickABook,
  newComment,
  seeProfile,
  bookDetails,
  getProfile
} = require("../controllers/userControllers");

//VISTA DE TODOS LOS LIBROS
router.get("/index", indexGet);
router.get("/:id/book-details", bookDetails);
router.post("/:id/pick", pickABook);

//CONFIRMATION
router.get("/confirmation", (_, res) => {
  res.render("user/confirmation");
});

//ADD NEW - CREATE
router.get("/new", (_, res) => {
  res.render("user/new");
});
router.post("/new/ISBN", uploadCloud.single("photo"), ISBNform);
router.post("/new/form", uploadCloud.single("photo"), postForm);

//PATCH FORM - UPDATE
router.get("/:id/patch", getpatchForm);
router.post("/:id/patch", patchForm);

//DELETE
router.post("/:id/delete", deleteBook);

//PROFILES
router.get("/profile", getProfile);
router.get("/:id/profile", seeProfile);
router.post("/new/comment", newComment);

module.exports = router;
