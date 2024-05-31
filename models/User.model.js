const { Schema, model } = require("mongoose");


const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    animes: [{ type: Schema.Types.ObjectId, ref: "Anime" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }], 
    ratings: [{ type: Schema.Types.ObjectId, ref: "Rating" }]
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
