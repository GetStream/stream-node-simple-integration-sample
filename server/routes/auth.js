const express = require("express");

const { signup, login, users, feedWebhook } = require("../controllers/auth.js");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post('/users', users);
router.post('/webhook', feedWebhook);
router.get('/webhook', feedWebhook);

module.exports = router;
