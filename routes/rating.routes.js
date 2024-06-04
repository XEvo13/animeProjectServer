const express = require("express");
const router = express.Router();
const Rating = require("../models/Rating.model");
const Action = require("../models/Action.model");
const User = require("../models/User.model");

//Create a new rating -- OTHER WAY
router.post("/ratings", (req, res) => {
  const { user, anime, score } = req.body;

  Rating.create({ user, anime, score })
    .then((rating) => {
      //Create an Action
      return Action.create({
        user,
        type: "rating",
        anime,
        rating: rating._id,
      }).then((actionRating) => {
        return User.findByIdAndUpdate(user, {
          $push: { ratings: rating._id },
        }).then(() => {
          res.status(201).json({ rating: rating, action: actionRating });
        });
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

// Update rating by ID
router.put("/ratings/:ratingId", (req, res) => {
  const { ratingId } = req.params;
  const { score, actionsId } = req.body;

  Rating.findByIdAndUpdate(ratingId, { score }, { new: true })
    .then((rating) => {
      if (!rating) {
        return res.status(404).json({ error: "Rating not found" });
      }
      return Action.findByIdAndUpdate(actionsId).then((actionRating) => {
        res.json({ rating, action: actionRating });
      });
    })
    .catch((error) => {
      console.error("Error updating rating by ID", error);
      res.status(500).json({ error: "Failed to update rating by ID" });
    });
});

//Delete a rating by Id
router.delete("/ratings/:ratingId/:actionsId", (req, res) => {
  const { ratingId, actionsId } = req.params;

  Rating.findByIdAndDelete(ratingId)
    .then((rating) => {
      if (!rating) {
        return res.status(404).json({ error: "Rating not found" });
      }
      return Action.findByIdAndDelete(actionsId).then((actionRating) => {
        return User.findByIdAndUpdate(rating.user, {
          $pull: { ratings: rating._id },
        }).then(() => {
          res.json({ rating, action: actionRating });
        });
      });
    })
    .catch((error) => {
      console.error("Error updating deleting by ID", error);
      res.status(500).json({ error: "Failed to delete rating by ID" });
    });
});

module.exports = router;
