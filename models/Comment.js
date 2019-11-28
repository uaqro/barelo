const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  body: String,
  swapperPosting: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  swapperRec: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  show: {
    type: Boolean,
    default: true
  }
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
