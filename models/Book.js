const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: {
    type: String,
    require: true
  },
  description: {
    type: String,
    require: true
  },
  author: [String],
  pages: Number,
  categories: Array,
  pic: String,
  idioma: String,
  publisher: String,
  publishDate: String,
  swapper: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  placePic: String,
  place: {
    type: {
      type: String,
      default: "Point",
      require: true
    },
    address: {
      type: String,
      require: true
    },
    coordinates: {
      type: [Number],
      require: true
    }
  },
  picked: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

bookSchema.index({
  "place": "2dsphere"
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;