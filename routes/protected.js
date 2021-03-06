const router = require("express").Router();
const uploadCloud = require("../config/cloudinary");
const {
  indexGet,
  ISBNform,
  postForm,
  getpatchForm,
  patchForm,
  deleteBook,
  delBook,
  pickABook,
  newComment,
  seeProfile,
  bookDetails,
  getProfile,
  confirmBook,
  deleteUser,
  editUser,
  patchUser,
  editComment,
  patchComment,
  deleteComment
} = require("../controllers/userControllers");

router.get("/index", indexGet);
router.get("/:id/book-details", bookDetails);
router.post("/:id/pick", pickABook);
router.get("/new", (_, res) => {
  res.render("user/new");
});
router.post("/new/ISBN", uploadCloud.single("photo"), ISBNform);
router.get("/:id/confirm", confirmBook);
router.get("/:id/patch", getpatchForm);
router.post("/:id/patched", uploadCloud.single("photo"), patchForm);
router.get("/:id/delete", deleteBook);
router.get("/:id/delete-origin", delBook);

router.get("/profile", getProfile);
router.get("/:id/profile", seeProfile);
router.get("/delete-user", deleteUser);
router.get("/patch-user", editUser);
router.post("/patched", uploadCloud.single("photo"), patchUser);

router.post("/:id/new-comment", newComment);
router.get("/:id/delete-comment", deleteComment);
router.get("/:id/edit-comment", editComment);
router.post("/:id/patch-comment", patchComment);

module.exports = router;
