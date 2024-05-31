const express = require("express");
const router = express.Router();
const Rating = require("../models/Rating.model");
const Action = require("../models/Action.model");

// Create a new rating
/* router.post("/ratings", (req, res) => {
  const { user, anime, score } = req.body;
  const newRating = new Rating({ user, anime, score });

  newRating
    .save()
    .then((savedScore) => {
      res.status(201).json(savedScore);
    })
    .catch((error) => {
      res.status(400).json({ message: "Error creating rating", error });
    });
}); */
//Create a new rating -- OTHER WAY
router.post("/ratings", (req, res) => {
  const { user, anime, score } = req.body;

  Rating.create({ user, anime, score })
    .then((savedRating) => {
      //Create an Action
      return Action.create({
        user,
        type: "rating",
        anime,
        rating: savedRating._id,
      }).then((savedAction) => {
        res.status(201).json({ rating: savedRating, action: savedAction });
      });
    })
    .catch((error) => {
      res.status(400).json({ message: "Error creating rating", error });
    });
});

// Get all ratings for an anime
router.get("/:animeId/ratings", (req, res) => {
  const { animeId } = req.params;

  Rating.find({ anime: animeId })
    .populate("user", "name")
    .populate("anime")
    .then((ratings) => {
      res.status(200).json(ratings);
    })
    .catch((error) => {
      res.status(400).json({ message: "Error finding the rating", error });
    });
});

//Update rating by id
router.put("/:animeId/ratings/:ratingId", (req, res) => {
  const { ratingId } = req.params;
  const { score } = req.body;

  Rating.findByIdAndUpdate(ratingId, { score }, { new: true })
    .then((rating) => {
      if (!rating) {
        return res.status(404).json({ error: "Rating not found" });
      }
      res.json(rating);
    })
    .catch((error) => {
      console.error("Error updating rating by Id", error);
      res.status(500).json({ error: "Fail to update by Id" });
    });
});

//Delete a rating by Id
router.delete("/:animeId/ratings/:ratingId", (req, res) => {
  const { ratingId } = req.params;

  Rating.findByIdAndDelete(ratingId)
    .then((rating) => {
      if (!rating) {
        return res.status(404).json({ error: "Rating not found" });
      }
      res.json(rating);
    })
    .catch((error) => {
      console.log(error("Error deleting rating", error));
      res.status(500).json({ error: "Fail to delete rating" });
    });
});

module.exports = router;
