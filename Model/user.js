const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
 
  phone_number: { type:Number, required: true },
  priority: { type: Number, enum: [0, 1, 2], default: 0 },
  token: {
  type:String
  },
});

// const user = mongoose.model('user', userSchema);

// module.exports = user;
module.exports = mongoose.model("user", userSchema)