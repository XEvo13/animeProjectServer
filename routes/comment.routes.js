const router = require("express").Router();
const Comment = require("../models/Comment.model")
const Action = require("../models/Action.model")
const User = require("../models/User.model")

// POST COMMENTS AND ACTIONS

router.post("/comments", (req, res)=> {
    const {user, anime, content} = req.body

    Comment.create({
      user,
      anime, 
      content
    })
    .then((comment) =>{
        return Action.create({
            user,
            type: "comment",
            anime,
            comment: comment._id
        })
        .then((commentAction) => {
            return User.findByIdAndUpdate(user, {$push: {comments: comment._id}})
            .then(()=> {
                res.status(201).json({comment, action:commentAction})
            })
            
        })
    })
    .catch((error) => {
        res.status(400).json({ message: "Error creating comment", error });
    });
})

  // GET COMMENTS BY ANIME

router.get("/:animeId/comments", (req,res)=>{
    const {animeId} = req.params;
    // console.log(animeId);
    Comment.findById(animeId)
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

router.put("/comments/:commentId",  (req, res)=> {
    const {commentId } = req.params;
    const {user, content, actionsId } = req.body;

    Comment.findByIdAndUpdate(commentId, {content}, {new: true})
    .then((comment) => {
        if(!comment) {
            return res.status(404).json({ error: "Rating not found" });
        }
         return Action.findByIdAndUpdate(actionsId, {
            
         })
         .then((actionComment) => {
            res.json({comment, action: actionComment})
         })
        //  .catch((error)=> {
        //     console.error("Error updating comment by Id", error)
        //     res.status(500).json({error: "Failed to update comment by Id"})
        //  }) 
        // res.json(comment);
    })
    .catch((error) => {
        console.error("Error updating rating by Id", error);
        res.status(500).json({ error: "Fail to update by Id" });
})
})

    //  DELETE THE COMMENT
router.delete("/comments/:commentId/:actionsId", (req, res) => {
    const {commentId, actionsId} = req.params;

    Comment.findByIdAndDelete(commentId)
    .then((comment) => {
        if(!comment) {
            return res.status(404).json({error: 'Comment not found'})
        }
        return Action.findByIdAndDelete(actionsId)
        .then((actionComment)=> {
            return User.findByIdAndUpdate(comment.user,{ $pull: {comments: commentId}})
            .then(()=> {
                res.json({comment, action: actionComment})
            })
        })
    })
    .catch((error)=> {
        console.log(error('Error deleting comment by Id', error));
        res.status(500).json({error: 'Fail to delete comment by Id'})
      });    
})

module.exports = router;