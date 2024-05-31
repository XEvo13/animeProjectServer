const { Schema, model } = require("mongoose");

const actionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["comment", "rating", "anime"], required: true },
  comment: { type: Schema.Types.ObjectId, ref: "Comment" },
  rating: { type: Schema.Types.ObjectId, ref: "Rating" },
  anime: { type: Schema.Types.ObjectId, ref: "Anime" },
  createdAt: { type: Date, default: Date.now },
});

const Action = model("Action", actionSchema);
module.exports = Action;
