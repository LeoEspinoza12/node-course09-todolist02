const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    require: true
  },
  admin: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});


var Users = mongoose.model('User', userSchema);

module.exports = Users
