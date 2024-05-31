const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User  = require("../models/User.model");


// SIGN UP

router.post("/signup", async(req, res)=> {
    const {password, email, name} = req.body;

    if(!name || ! email || !password ) {
        res.status(400).send({ error: "Please provide username, password and name" });
        return;
    }

    const existingUser = await User.findOne({email});
    if(existingUser) {
        res.status(400).send({ error: "User already exists" });
        return;
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
