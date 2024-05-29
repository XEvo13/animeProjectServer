const router = require("express").Router();
// const axios = require("axios");

router.get("/", (req, res, next) => {
  res.json("All good in here");
});


// GET ALL ANIME
// router.get("/anime/all", async(req, res)=>  )

module.exports = router;
