const crypto = require("crypto");
const bcrypt = require("bcrypt");
const algoliasearch = require('algoliasearch');
const Mux = require('@mux/mux-node');

require("dotenv").config();

const {
    loginHandler,
    registerUser,
    signupHandler,
    verifyUser,
    searchUsers,
    searchUsersHandler,
    chPasswordHandler,
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

const chpasswd = async (req, res) => {
    try {
        const { username, password, newPassword } = req.body;

        verifyUser(username, password, (err, result) => {
            chPasswordHandler(err, result, res, newPassword);
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
    const algolia_users_index_name = process.env.ALGOLIA_USERS_INDEX_NAME;

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
            const updatedUser = element.generic
            if (updatedUser != null) {
                const usersIndex = client.initIndex(algolia_users_index_name);

                updatedUser.objectID = updatedUser.id;
                usersIndex.saveObjects([updatedUser], { autoGenerateObjectIDIfNotExist: false }).catch((err) => {
                    console.log(err);
                });
            }
            if (newItems != null) {
                newItems.forEach(item => {
                   item.objectID = item.id;
                   // delete item.actor["data"];
                   item.time = new Date(item.time).getTime();
                   item.actor.created_at = new Date(item.actor.created_at).getTime();
                  item.actor.updated_at = new Date(item.actor.updated_at).getTime();
                  // console.log(JSON.stringify(item));
                });

                index.saveObjects(newItems, { autoGenerateObjectIDIfNotExist: false }).catch((err) => {
                    console.log(err);
                });

            }
        });
        res.status(200).json(req.body)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const muxUpload = async (req, res) => {
    const mux_token_id = process.env.MUX_TOKEN_ID;
    const mux_token_secret = process.env.MUX_TOKEN_SECRET;

    const { Video } = new Mux(mux_token_id, mux_token_secret);

    try {
        Video.Uploads.create({
            new_asset_settings: {
                playback_policy: ['public'],
            }
        }).then((upload) => {
            res.status(200).json({ upload_id: upload.id, upload_url: upload.url, upload_expiry: upload.expires_at });
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const muxPlayback = async (req, res) => {
    const mux_token_id = process.env.MUX_TOKEN_ID;
    const mux_token_secret = process.env.MUX_TOKEN_SECRET;

    const { asset_id } = req.body;

    const { Video } = new Mux(process.env.MUX_TOKEN_ID, process.env.MUX_TOKEN_SECRET);

    Video.Assets.get(asset_id).then((asset) => {
        console.log(asset.playback_ids);
        res.status(200).json({ playback_ids: asset.playback_ids });
    });
};

const muxAsset = async (req, res) => {
    const mux_token_id = process.env.MUX_TOKEN_ID;
    const mux_token_secret = process.env.MUX_TOKEN_SECRET;

    const { upload_id } = req.body;

    const { Video } = new Mux(process.env.MUX_TOKEN_ID, process.env.MUX_TOKEN_SECRET);

    Video.Uploads.get(upload_id).then((upload) => {
        console.log(upload);
        res.status(200).json({ asset_id: upload.asset_id, status: upload.status });
    });
};

module.exports = { signup, login, chpasswd, users, feedWebhook, muxUpload, muxPlayback, muxAsset };
