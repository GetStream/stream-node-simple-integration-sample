const { connect } = require("getstream");
const StreamChat = require("stream-chat").StreamChat;
const bcrypt = require("bcrypt");

const { getClient } = require('../db');

require("dotenv").config();

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID;

const verifyUser = async (username, password, cb) => {
    const client = await getClient();
    await client.query(
        "SELECT * FROM users WHERE username = $1",
        [username],
        function (err, result) {
            if (err) {
                return cb(err);
            }
            if (!result.rows[0]) {
                return cb("User with this username doesn't exist.");
            }
            const row = result.rows[0];
            const hashed_password = bcrypt.hashSync(password, row.salt);
            if (hashed_password === row.hashed_password) {
                cb(null, row);
            } else {
                return cb("Incorrect Password.");
            }
        }
    );
    // await client.end();
};

const registerUser = async (userId, username, password, cb) => {
    const salt = bcrypt.genSaltSync(10);
    const hashed_password = bcrypt.hashSync(password, salt);

    const client = await getClient();
   
    const sql =
        'INSERT INTO users (id, username, hashed_password, salt) VALUES ($1, $2, $3, $4) RETURNING *';
    const params = [userId, username, hashed_password, salt];
    await client.query(sql, params, (err, innerResult) => {
        if (err) {
            cb(err, innerResult);
        } else {
            cb(null, { userId, username, hashed_password, salt });
        }
    });
    // await client.end();
};

const searchUsers = async (searchTerm, selfUserId, cb) => {
    const sql = "SELECT id, username FROM users WHERE username LIKE $1 AND id != $2";
    const params = ["%" + searchTerm + "%", selfUserId];
    const client = await getClient();
    await client.query(sql, params, (err, innerResult) => {
        if (err) {
            cb(err, innerResult);
        } else {
            cb(null, innerResult.rows );
        }
    });
};

const signupHandler = async (err, result, res) => {
    if (err) {
        res.status(500).json({ message: err });
        return;
    }
    const { username, userId } = result;
    const feedClient = connect(api_key, api_secret, app_id, {
        location: "eu-west",
    });
    const chatClient = StreamChat.getInstance(api_key, api_secret); //, location = "eu-west");
    chatClient.upsertUser({
        id: userId,
        username: username,
    });

    const feedToken = feedClient.createUserToken(userId);
    const chatToken = chatClient.createToken(userId);

    res.status(200).json({ feedToken, chatToken, username, userId });
};

const loginHandler = async (error, result, res) => {
    if (error) {
        res.status(500).json({ message: error });
        return;
    }
    const { username, id } = result;
    const feedClient = connect(api_key, api_secret, app_id, {
        location: "eu-west",
    });
    const chatClient = StreamChat.getInstance(api_key, api_secret); //, location="eu-west"
    const { users } = await chatClient.queryUsers({
        username: { $eq: username },
    });
    if (!users.length) {
        return res
            .status(400)
            .json({ message: "User not found in Chat Database" });
    }

    const chatToken = chatClient.createToken(id);
    const feedToken = feedClient.createUserToken(id);

    res.status(200).json({
        feedToken,
        chatToken,
        username,
        userId: id,
    });
};

const chPasswordHandler = async (err, result, res, newPassword) => {
    if (err) {
        res.status(500).json({ message: err });
        return;
    }

    if (newPassword == undefined) {
        res.status(500).json({ message: "No new password." });
        return;
    }
    
    const { username, id } = result;
    const salt = bcrypt.genSaltSync(10);
    const hashed_password = bcrypt.hashSync(newPassword, salt);

    const client = await getClient();
    const sql = "UPDATE users SET hashed_password = $1, salt = $2 WHERE id = $3";
    const params = [hashed_password, salt, id];

    await client.query(sql, params, (err, innerResult) => {
        if (err) {
            res.status(500).json({ message: err });
            return;
        }
        res.status(200).json({ message: "Password changed successfully" });
    });
};

const searchUsersHandler = async (err, result, res) => {
    if (err) {
        res.status(500).json({ message: err });
        return;
    }
    res.status(200).json({ results: result });
};
    


module.exports = { verifyUser, loginHandler, registerUser, signupHandler, searchUsersHandler, searchUsers, chPasswordHandler };
