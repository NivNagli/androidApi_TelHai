const bcrypt = require('bcryptjs');
const axios = require('axios');
const User = require('../models/user');
const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');


exports.signup = async (req, res, next) => {
    /* First we will check if we received errors from the route with the help of express-validator third party package */
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new HttpError('Invalid inputs passed, please check your data.', 422);
        return next(error);
    }
    const { email, password } = req.body;


    /* Check if there is already a existing user for this email address */
    let checkForExistingUser;
    try {
        checkForExistingUser = await User.findOne({ email: email });
    }
    catch (err) {
        console.log(err);
        const error = new HttpError(
            'Signing up failed, please try again later.',
            500
        );
        return next(error);
    }

    if (checkForExistingUser) {
        const error = new HttpError(
            'User exists already under this email, please login instead.',
            422
        );
        return next(error);
    }

    /* Try to create the new user after all the checks process are done and valid. */

    // I'm going to create hash value from the password in order to not expose the original passwords in case of a leak in the database ... 
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    }
    catch (err) {
        const error = new HttpError('Failed to create a new user, please try again', 500);
        next(error);
    }

    /* 
        Now I'm going to check if someone already searched for this user in our site and if so i will use the existing game profile from the
        database, or create a new game profile if not found one in the database.
    */

    /* The case we dont have existing profile in the database i will create a new one and save him */

    try {
        const createdUser = new User({
            email,
            password: hashedPassword,
            meals: [],
            numberOfOrders : 0
        });
        await createdUser.save();
        console.log("New user in the site just created and saved in the database.");
        res
            .status(201)
            .json({ isSignup: true });
        return;

    }
    catch (err) {
        console.log(err);
        const error = new HttpError(
            'Signing up failed, please try again later.',
            500
        );
        return next(error);
    }


};


exports.login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new HttpError('Invalid inputs passed, please check your data.', 422);
        return next(error);
    };

    const { email, password } = req.body;
    let existingUser;

    try {
        existingUser = await User.findOne({ email: email });
    }
    catch (err) {
        const error = new HttpError("Logging in failed, please try again later.", 500);
        return next(error);
    }

    if (!existingUser) {
        const error = new HttpError("Invalid credentials, could not log you in.", 403);
        return next(error);
    }

    let passwordIsValid = false;
    try {
        passwordIsValid = await bcrypt.compare(password, existingUser.password);
    }
    catch (err) {
        const error = new HttpError("Logging in failed, please check your credentials and try again.");
        return next(error);
    }

    if (!passwordIsValid) {
        const error = new HttpError("Invalid credentials, could not log you in.", 403);
        return next(error);
    }

    console.log("Login succeed!");
    res
        .status(200)
        .json({ isLogin: true });
};

