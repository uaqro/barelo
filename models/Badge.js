const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const badgeSchema = new Schema({
  name: String,
  image: String,
  swapper: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

const Badge = mongoose.model("Badge", badgeSchema);
module.exports = Badge;
