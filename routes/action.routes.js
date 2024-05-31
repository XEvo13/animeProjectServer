const express = require("express");
const router = express.Router();
const Action = require("../models/Action.model");

// Create a new action
router.post("/actions", (req, res) => {
  const { user, anime, type, comment, rating } = req.body;
  const newAction = new Action({ user, type, comment, rating, anime });

  newAction
    .save()
    .then((savedAction) => {
      res.status(201).json(savedAction);
    })
    .catch((error) => {
      res.status(400).json({ message: "Error creating action", error });
    });
});

// Get all actions by Id
router.get("/:actionsId/actions", (req, res) => {
  const { actionsId } = req.params;

  Action.find({ actions: actionsId })
    .populate("user")
    .populate("comment")
    .populate("rating")
    .populate("anime")
    .sort({ createdAt: -1 })
    //.sort() sorts the results by the createdAt
    //field in descending order
    .then((actions) => {
      res.status(200).json(actions);
    })
    .catch((error) => {
      res.status(400).json({ message: "Error fetching actions", error });
    });
});

module.exports = router;
