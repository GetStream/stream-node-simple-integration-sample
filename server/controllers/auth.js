const crypto = require("crypto");
const bcrypt = require("bcrypt");
require("dotenv").config();

const webhook_token = process.env.WEBHOOK_TOKEN;
const {
    loginHandler,
    registerUser,
    signupHandler,
    verifyUser,
    searchUsers,
    searchUsersHandler,
} = require("../utils");

const signup = async (req, res) => {
    try {
        const { username, password } = req.body;
        const userId =username;

        registerUser(userId, username, password, (err, result) => {
            signupHandler(err, result, res);
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        verifyUser(username, password, (err, result) => {
            loginHandler(err, result, res);
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const users = async (req, res) => {
    try {
        const { searchTerm, selfUserId } = req.body;

        searchUsers(searchTerm, selfUserId, (err, result) => {
            searchUsersHandler(err, result, res);
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const feedWebhook = async (req, res) => {
    if (req.query.webhook_token != webhook_token) {
        res.status(403).send('Forbidden');
        return;
    }
    if (req.method == "GET") {
        res.status(200).send('dn4mpr346fns');
        return;
    }
    try {
        console.log(JSON.stringify(req.body));
        res.status(200).send('OK');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { signup, login, users, feedWebhook };
