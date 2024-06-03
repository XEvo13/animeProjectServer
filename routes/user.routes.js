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

// USER FRIEND ADD
router.put("/:userId/friend/:friendId", (req, res) => {
    const { userId, friendId } = req.params;

    User.findByIdAndUpdate(
        userId,
        { $addToSet: { friends: friendId } }, // addToSet ensures no duplicates
        { new: true }
    )
    .populate("friends")
    .then((user) => {
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        return User.findByIdAndUpdate(
            friendId,
            { $addToSet: { friends: userId } }, // addToSet ensures no duplicates
            { new: true }
        )
        .populate("friends")
        .then((friend) => {
            if (!friend) {
                return res.status(404).json({ error: "Friend not found" });
            }

            res.json({ user, friend });
        });
    })
    .catch((error) => {
        console.error("Error adding friend by Id", error);
        res.status(500).json({ error: "Fail to add friend by Id" });
    });
});

router.put("/:userId/unfriend/:friendId", (req, res) => {
    const { userId, friendId } = req.params;

    User.findByIdAndUpdate(
        userId,
        { $pull: { friends: friendId } }, // $pull removes the friendId from the friends array
        { new: true }
    )
    .populate("friends")
    .then((user) => {
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        return User.findByIdAndUpdate(
            friendId,
            { $pull: { friends: userId } }, // $pull removes the userId from the friends array
            { new: true }
        )
        .populate("friends")
        .then((friend) => {
            if (!friend) {
                return res.status(404).json({ error: "Friend not found" });
            }

            res.json({ user, friend });
        });
    })
    .catch((error) => {
        console.error("Error removing friend by Id", error);
        res.status(500).json({ error: "Fail to remove friend by Id" });
    });
});


// ADD ANIME

router.put("/:userId/anime/:animeId", (req, res) => {
    const { userId, animeId } = req.params;

    User.findByIdAndUpdate(
        userId,
        { $addToSet: { animes: animeId } }, 
        { new: true }
    )
    .populate("animes")
    .then((user) => {
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    })
    .catch((error) => {
        console.error("Error adding anime by Id", error);
        res.status(500).json({ error: "Fail to add anime by Id" });
    });
});


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