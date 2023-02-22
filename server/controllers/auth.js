const crypto = require("crypto");
const bcrypt = require("bcrypt");
const algoliasearch = require('algoliasearch');

require("dotenv").config();

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
    const webhook_token = process.env.WEBHOOK_TOKEN;
    const algolia_app_id = process.env.ALGOLIA_APP_ID;
    const algolia_api_key = process.env.ALGOLIA_API_KEY;
    const algolia_index_name = process.env.ALGOLIA_INDEX_NAME;

    if (req.query.webhook_token != webhook_token) {
        res.status(403).send('Forbidden');
        return;
    }
    if (req.method == "GET") {
        res.status(200).send('dn4mpr346fns');
        return;
    }
    try {
        const client = algoliasearch(algolia_app_id, algolia_api_key);
        const index = client.initIndex(algolia_index_name);
        console.log(JSON.stringify(req.body));
        req.body.forEach(element => {
            const newItems = element.new;
            const deletedItems = element.deleted;
            newItems.forEach(item => {
                item.objectID = item.id;
                // delete item.actor["data"];
                item.time = new Date(item.time).getTime();
                item.actor.created_at = new Date(item.actor.created_at).getTime();
                item.actor.updated_at = new Date(item.actor.updated_at).getTime();
                // console.log(JSON.stringify(item));
            });

            index.saveObjects(newItems, { autoGenerateObjectIDIfNotExist: false });
        });
        res.status(200).json(req.body)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { signup, login, users, feedWebhook };
