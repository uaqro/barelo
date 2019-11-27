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
        ref: "Books Given"
      }
    ],
    pickedBooks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Books Picked"
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
          type: [Number],
          require: true
        }
      }
    }
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
