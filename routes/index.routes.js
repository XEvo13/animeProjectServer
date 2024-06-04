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

// GET SINGLE ANIME
router.get('/anime/:id', (req, res) => {
  const { id } = req.params;

  Anime.findById(id)
    .then(anime => {
      if (!anime) {
        return res.status(404).json({ error: 'Anime not found' });
      }
      res.status(200).json(anime);
    })
    .catch(error => {
      console.error('Error fetching anime details:', error);
      res.status(500).json({ error: 'Failed to fetch anime details' });
    });
});


module.exports = router;
