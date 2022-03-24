const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mealSchema = new Schema({
    mealName: { type: String, required: true },
    price: { type: Number, required: true}
});

module.exports = mongoose.model('Meal', mealSchema);