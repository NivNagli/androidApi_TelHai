const express = require('express');
const { check } = require('express-validator');
const router = express.Router();

const orderController = require('../controller/order');

router.post(
    '/add-meal',

    [
        check('email')
        .normalizeEmail()
        .isEmail(),

        check('mealName')
        .isLength({min : 1})
    ],

    orderController.addMeal
);

router.post(
    '/create-meal',

    [
        check('mealName')
        .isLength({min : 1}),

        check('price')
        .isLength({min : 1})
    ],

    orderController.createMeal
);

router.post(
    '/get-meals',

    [
        check('email')
        .normalizeEmail()
        .isEmail()
    ],

    orderController.getMeals
);

router.post(
    '/update-orders-number',

    [
        check('email')
        .normalizeEmail()
        .isEmail()
    ],

    orderController.updateNumOfOrders
);

router.post(
    '/add-meals',

    [
        check('email')
        .normalizeEmail()
        .isEmail()
    ],

    orderController.addMeals
);

module.exports = router;