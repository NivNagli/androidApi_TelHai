const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Meal = require('./meal');

const userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true, minlength: 5 },
    meals: [
        {
            mealId: {
                type: Schema.Types.ObjectId,
                ref: 'Meal',
                required: true
            },
            quantity: { type: Number, required: true }
        }
    ],
    numberOfOrders : {type: Number, required: true}
});

userSchema.methods.addMeal = async function (mealId, quantity) {
    let mealExists;
    if (!quantity) {
        quantity = 1;
    }
    for (let meal of this.meals) {
        if (meal.mealId.equals(mealId)) {
            mealExists = meal;
            break;
        }
    }
    if (mealExists) {
        mealExists.quantity += quantity;
        return;
    }
    if (!mealExists) {
        const oldMeals = [...this.meals];
        oldMeals.push({
            mealId: mealId,
            quantity: quantity
        });
        this.meals = oldMeals;
        return;
    }
};

userSchema.methods.getMeals = async function () {
    const cart = await getMealsHelper(this.meals);
    return cart;
};
userSchema.methods.updateNumOfOrders = async function () {
    this.numberOfOrders += 1;
    return;
};

const getMealsHelper = async (meals) => {
    const cart = [];
    for(let meal of meals) {
        const currentMeal = await Meal.findById(meal.mealId);
        // console.log(currentMeal.mealName);
        const newItem = {
            mealName: currentMeal.mealName,
            quantity: meal.quantity
        }
        cart.push(newItem);
    }
    return cart;
};

module.exports = mongoose.model('User', userSchema);