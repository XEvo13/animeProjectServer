const {Schema, model} = require("mongoose")

const ratingSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    anime: { type: Schema.Types.ObjectId, ref: 'Anime', required: true },
    score: { type: Number, required: true, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now }
  });
  
  const Rating = model('Rating', ratingSchema);
  module.exports = Rating;