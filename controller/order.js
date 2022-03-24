const HttpError = require('../models/http-error');
const Meal = require('../models/meal');
const User = require('../models/user');
const { validationResult } = require('express-validator');

exports.addMeal = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new HttpError('Invalid inputs passed, please check your data.', 422);
        return next(error);
    };

    const { mealName, email, quantity } = req.body;
    let existingUser;
    let existingMeal;

    try {
        existingUser = await User.findOne({ email: email });
        existingMeal = await Meal.findOne({ mealName: mealName });
    }
    catch (err) {
        const error = new HttpError("Add meal in failed, please try again later.", 500);
        console.error(err);
        return next(error);
    }

    if (!existingUser) {
        const error = new HttpError("Invalid credentials, must provide a valid user.", 403);
        return next(error);
    }

    if(!existingMeal) {
        const error = new HttpError("Invalid Meal, She not exists!", 403);
        return next(error);
    }

    await existingUser.addMeal(existingMeal._id, quantity);

    console.log("Meal Added");
    res
        .status(200)
        .json({ mealAdded: true });
};

exports.createMeal = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new HttpError('Invalid inputs passed, please check your data.', 422);
        return next(error);
    };

    const { mealName, price } = req.body;
    let existingMeal;

    try {
        existingMeal = await Meal.findOne({ mealName: mealName });
    }
    catch (err) {
        const error = new HttpError("Add meal in failed, please try again later.", 500);
        console.error(err);
        return next(error);
    }

    if(existingMeal) {
        console.log("Meal Exists.");
    }
    else{
        const newMeal = new Meal({
            mealName:mealName,
            price:parseFloat(price)
        });
        await newMeal.save();
        console.log("Meal Added");
    }
    res
        .status(200)
        .json({ mealCreated: true });
};

exports.getMeals = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new HttpError('Invalid inputs passed, please check your data.', 422);
        return next(error);
    };

    const { email } = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    }
    catch (err) {
        const error = new HttpError("Add meal in failed, please try again later.", 500);
        console.error(err);
        return next(error);
    }

    if (!existingUser) {
        const error = new HttpError("Invalid credentials, must provide a valid user.", 403);
        return next(error);
    }
    const cart = await existingUser.getMeals();
    res 
        .status(200)
        .json({ Cart: cart });
};

exports.updateNumOfOrders = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new HttpError('Invalid inputs passed, please check your data.', 422);
        return next(error);
    };

    const { email } = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    }
    catch (err) {
        const error = new HttpError("Add meal in failed, please try again later.", 500);
        console.error(err);
        return next(error);
    }

    if (!existingUser) {
        const error = new HttpError("Invalid credentials, must provide a valid user.", 403);
        return next(error);
    }
    await existingUser.updateNumOfOrders();
    const freeMeal = ((existingUser.numberOfOrders % 10 === 0) && (existingUser.numberOfOrders !== 0));
    res 
    .status(200)
    .json({ freeMeal: freeMeal });

};

exports.addMeals = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new HttpError('Invalid inputs passed, please check your data.', 422);
        return next(error);
    };

    const { Pasta, Steak, Hummus, Carpaccio,Salad, Salmon, email } = req.body;
    let existingUser;
    let existingMeals;
    const mealNames = ["Pasta", "Steak", "Humus", "Carpaccio", "Salad", "Salmon"];
    const meals = [Pasta, Steak, Hummus, Carpaccio,Salad, Salmon];
    const indexes = [];
    try {
        existingUser = await User.findOne({ email: email });
        existingMealsBarrier = [];
        mealNames.forEach((meal, index) => {
            if(meals[index]) {
                existingMealsBarrier.push(Meal.findOne({ mealName: meal }));
                indexes.push(index);
                
            };
        });
        existingMeals = await Promise.all(existingMealsBarrier);
    }
    catch (err) {
        const error = new HttpError("Add meal in failed, please try again later.", 500);
        console.error(err);
        return next(error);
    }

    if (!existingUser) {
        const error = new HttpError("Invalid credentials, must provide a valid user.", 403);
        return next(error);
    }
    const updateMealsBarrier = [];
    existingMeals.forEach((meal,index) => {updateMealsBarrier.push(existingUser.addMeal(meal._id, parseInt(meals[indexes[index]])))});
    existingUser.updateNumOfOrders();
    await existingUser.save();
    const bonus = existingUser.numberOfOrders % 10 === 0 && existingUser.numberOfOrders !== 0;
    // for(m of existingMeals) { 
    //     await m.then(res => {});
    // }

    console.log("Meals Added");
    res
        .status(200)
        .json({ getBonus: bonus });
};
