const router = require("express").Router();
// const axios = require("axios");
const Anime = require("../models/Anime.model")
const Comment = require("../models/Comment.model")

router.get("/", (req, res, next) => {
  res.json("All good in here");
});


// GET ALL ANIME
router.get('/animes', (req, res) => {
  Anime.find({}).select("title picture episodes")
    .then((anime) => {
      console.log("Retrived anime ->", anime);
      res.json(anime);
    })
    .catch((error) => {
      console.error("Error while retrieving cohorts ->", error);
      res.status(500).json({error: "Failed to retrieve cohorts"});
    });
})



module.exports = router;
