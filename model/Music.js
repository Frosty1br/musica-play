const mongoose = require("mongoose");

const musicSchema = new mongoose.Schema({
  NameMusic: {
    type: String,
    require: true,
  },
  NameAuthor: {
    type: String,
    require: true,
  },
  LinkImage: {
    type: String,
    require: true,
  },
  LinkMusic: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Music", musicSchema);