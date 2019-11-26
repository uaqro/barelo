const mongoose = require('mongoose');
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
    ref: 'swapper'
  },
  placePic: String,
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
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;