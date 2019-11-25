const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const bookSchema = new Schema({
    title:String,
    description:String,
    author:[String],
    pages: Number,
    categories: Array,
    pic: String,
    idioma: String,
    publisher: String,
    publishDate: String,
    swapper:{
      type: Schema.Types.ObjectId,
      ref: 'swapper'
      }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;