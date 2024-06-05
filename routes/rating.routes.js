const express = require("express");
const router = express.Router();
const Rating = require("../models/Rating.model");
const Action = require("../models/Action.model");
const User = require("../models/User.model");

// Create a new rating
router.post("/ratings", (req, res) => {
    const { user, anime, score } = req.body;

    Rating.create({ user, anime, score })
        .then((rating) => {
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

// Get a specific user's rating for an anime
router.get("/ratings/:animeId/:userId", (req, res) => {
    const { animeId, userId } = req.params;

    Rating.findOne({ anime: animeId, user: userId })
        .then((rating) => {
            res.status(200).json(rating);
        })
        .catch((error) => {
            res.status(400).json({ message: "Error finding the rating", error });
        });
});

// Update rating by ID
router.put("/ratings/:ratingId", (req, res) => {
    const { ratingId } = req.params;
    const { score } = req.body;

    Rating.findByIdAndUpdate(ratingId, { score }, { new: true })
        .then((rating) => {
            if (!rating) {
                return res.status(404).json({ error: "Rating not found" });
            }
            res.json({ rating });
        })
        .catch((error) => {
            console.error("Error updating rating by ID", error);
            res.status(500).json({ error: "Failed to update rating by ID" });
        });
});

// Delete a rating by ID
router.delete("/ratings/:ratingId", (req, res) => {
    const { ratingId } = req.params;

    Rating.findByIdAndDelete(ratingId)
        .then((rating) => {
            if (!rating) {
                return res.status(404).json({ error: "Rating not found" });
            }
            return Action.findOneAndDelete({ rating: ratingId }).then((actionRating) => {
                return User.findByIdAndUpdate(rating.user, {
                    $pull: { ratings: ratingId },
                }).then(() => {
                    res.json({ rating, action: actionRating });
                });
            });
        })
        .catch((error) => {
            console.error("Error deleting rating by ID", error);
            res.status(500).json({ error: "Failed to delete rating by ID" });
        });
});

module.exports = router;
