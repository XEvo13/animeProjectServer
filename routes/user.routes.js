const router = require("express").Router();
const User = require("../models/User.model");

// GET USER
router.get("/:userId", (req, res)=> {
    const {userId} = req.params;

    User.findById(userId)
    .populate("friends")
    .populate("animes")
    .populate("comments")
    .populate("ratings")
    .then((user)=> {
        if(!user){
            return res.status(404).json({error: 'User not found' })
        }
        res.status(200).json(user)
    })
    .catch((error)=> {
        console.error('Error getting user by Id', error);
        res.status(500).json({ error: 'Failed to get user by Id'});
    })
})


// USER EDIT

router.put("/:userId/edit", (req, res)=>{
    const {name, friends, animes} = req.body;
    const {userId} = req.params;

    User.findByIdAndUpdate(userId, {name, friends, animes}, {new:true})
    .then((user) => {
        if(!user){
            return res.status(404).json({error: "User not found"})
        }
        res.json(user)
    })
    .catch((error) => {
        console.error("Error updating user by Id", error);
        res.status(500).json({error: "Fail to update user by Id"});
    })
})


// USER DELETE

router.delete("/:userId/edit", (req, res)=> {
    const {userId} = req.params;

    User.findByIdAndDelete(userId)
    .then((user) => {
    if(!user) {
        return res.status(404).json({error: "User not found"});
    }
    res.json(user)    
    })
    .catch((error)=> {
        console.log(error("Error deleting user by Id", error));
        res.status(500).json({error: "Fail to delete user by Id"})
    });
});

module.exports = router;