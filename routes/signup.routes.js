const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User  = require("../models/User.model");


// SIGN UP

router.post("/signup", async(req, res)=> {
    const {email, password, name} = req.body;

    if(!name || ! email || !password ) {
        // console.log("Error:", errorMessage);
        return res.status(400).json({ message: "Please provide username, password, and name" });
        
    }

    const existingUser = await User.findOne({email});
    if(existingUser) {     
        // console.log("Error:", errorMessage);   
        return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
        email,
        password: hashedPassword,
        name
        
    };

    const createdUser = await User.create(newUser);
    res.status(201).send(createdUser);
});

module.exports = router;
