const express = require("express");
const { payment_controller, stipe_webhook, Buy_a_course_controller } = require("../Controllers/PaymentController");

const PaymentRoute = require("express").Router();

PaymentRoute.post("/checkout", payment_controller);
PaymentRoute.post("/Buy_a_course_checkout", Buy_a_course_controller);
PaymentRoute.post("/webhook",stipe_webhook);
module.exports = PaymentRoute;

