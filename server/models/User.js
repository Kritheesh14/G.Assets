// server/models/User.js
const mongoose = require('mongoose');

// subdocument for connected engines
const engineSchema = new mongoose.Schema(
  {
    id: { type: String },        // "unity", "unreal", "godot"
    name: { type: String },      // "Unity"
    version: { type: String },   // "2022.3 LTS"
    connected: { type: Boolean, default: false }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },

    // profile fields
    fullName: {
      type: String,
      trim: true
    },
    avatarUrl: {
      type: String
    },
    bio: {
      type: String
    },
    website: {
      type: String
    },

    // connected game engines as shown in profile page
    engines: {
      type: [engineSchema],
      default: []
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
