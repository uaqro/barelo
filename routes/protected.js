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
  pickABook
} = require("../controllers/userControllers");

//VISTA DE TODOS LOS LIBROS
router.get("/index", indexGet);

//DETAIL - READ FUCKING WORKS!

router.get("/:id/book-details", async (req, res) => {
  const { id } = req.params;
  const { _id } = req.user;
  const buk = await books.findById(id);
  const usr = await user.findById(_id);
  const show = await usr.pickedBooks.includes(id);
  res.render("user/detail", { buk, show });
});

router.post("/:id/pick", pickABook);

//CONFIRMATION

router.get("/confirmation", (_, res) => {
  res.render("user/confirmation");
});

//USER PROFILE

router.get("/profile", async (req, res) => {
  const { id } = req.user;
  const swapper = await user
    .findById(id)
    .populate("pickedBooks publishedBooks");
  console.log(swapper);
  res.render("user/profile", swapper);
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

//Unlock image

router.post("/:id/getBook", async (req, res) => {});

module.exports = router;
