const crypto = require("crypto");
const bcrypt = require("bcrypt");

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

        registerUser(userId, username, password, function (err, result) {
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

module.exports = { signup, login, users };
