const router = require("express").Router();
const Comment = require("../models/Comment.model")
const Action = require("../models/Action.model")

// POST COMMENTS

router.post("/comments", (req, res)=> {
    const {user, anime, content} = req.body

    Comment.create({
      user,
      anime, 
      content
    })
    .then((comment) =>
    res.status(201).json(comment))
  })
    .then((actioncomment) =>{
        return Action.create({
            
        })
    })

  module.exports = router;

  // GET COMMENTS BY ANIME

router.get("/:animeId/comments", (req,res)=>{
    const {animeId} = req.params;
    // console.log(animeId);
    Comment.find({anime:animeId})
    .populate("user", "name")
    .populate("anime")
    .then((comments)=>{
        res.status(200).json(comments);
    })
    .catch((error) => {
        res.status(400).json({ message: "Error finding the comments", error });
    })
})

    // UPDATE COMMENTS BY ANIMEID AND COMMENT ID

router.put("/:animeId/comments/:commentId",  (req, res)=> {
    const {commentId} = req.params;
    const {content} = req.body;

    Comment.findByIdAndUpdate(commentId, {content}, {new: true})
    .then((comment) => {
        if(!comment) {
            return res.status(404).json({ error: "Rating not found" });
        }
        res.json(comment);
    })
    .catch((error) => {
        console.error("Error updating rating by Id", error);
        res.status(500).json({ error: "Fail to update by Id" });
})
})

    //  DELETE THE COMMENT
router.delete("/:animeId/comments/:commentId", (req, res) => {
    const {commentId} = req.params;

    Comment.findByIdAndDelete(commentId)
    .then((comment) => {
        if(!comment) {
            return res.status(404).json({error: 'Comment not found'})
        }
        res.json(comment);
    })
    .catch((error)=> {
        console.log(error('Error deleting comment by Id', error));
        res.status(500).json({error: 'Fail to delete comment by Id'})
      });    

})