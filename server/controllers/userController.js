import User from "../models/userModel.js";
import asyncHandler from '../middlewares/asyncHandler.js';

// hashing password library
import bcrypt from 'bcryptjs';

const createUser = asyncHandler(async (req, res) => {
    const {username, email, password} = req.body;

    // validation for checking these fields before sending data to database
    if(!username || !email || !password){
        throw new Error("Please fill all inputs");
    }

    // check for already existing email
    const userExists = await User.findOne({email});
    if(userExists){
        res.status(400).send("User already exists")
    }

    // hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create a user
    const newUser = new User({
        username,
        email, 
        password: hashedPassword
    })

    try{
        await newUser.save();

        res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            isAdmin: newUser.isAdmin,
        })
    }catch(error){
        res.status(400).send("Invalid user data");
    }
});

export {createUser};