const {Schema, model} = require("mongoose")

const animeSchema = new Schema({
    title: { type: String, required: true },
    // description: { type: String, required: true },
    picture: { type: String, required: true },
    episodes: { type: Number, required: true },
    // genre: [{ type: String, required: true }],
    // comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    // ratings: [{ type: Schema.Types.ObjectId, ref: 'Rating' }]
  });
  
  const Anime = model('Anime', animeSchema);
  module.exports = Anime;