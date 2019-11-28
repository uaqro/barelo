const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema(
  {
    username: String,
    email: String,
    photoURL: {
      type: String,
      default: "https://www.awlrescueme.com/images/Resources.jpg"
    },
    password: String,
    publishedBooks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Book"
      }
    ],
    pickedBooks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Book"
      }
    ],
    tokens: {
      type: Number,
      default: 0
    },
    place: {
      type: {
        address: {
          type: String,
          require: true
        },
        coordinates: {
          type: "Point",
          coordinates: [Number],
          require: true
        }
      }
    },
    badges: [
      {
        type: Schema.Types.ObjectId,
        ref: "Badges"
      }
    ],
    commentsRec: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment"
      }
    ],
    commentsPost: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment"
      }
    ]
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);
userSchema.plugin(passportLocalMongoose, { usernameField: "username" });
const User = mongoose.model("User", userSchema);
module.exports = User;
