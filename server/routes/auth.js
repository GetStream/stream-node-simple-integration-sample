const express = require("express");

const { signup, login, users } = require("../controllers/auth.js");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post('/users', users);

module.exports = router;
