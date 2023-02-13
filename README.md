# Sample Node integration server for [Stream Chat](https://getstream.io/chat/) and [Stream Feeds](https://getstream.io/activity-feeds/)

<p align="center">
	<img src="./assets/logo.svg" width="50%" height="50%">
</p>
<p align="center">
	Sample Node JavaScript server integration sample for Stream Chat, and Stream Feeds.
	<br />
	<a href="https://getstream.io/blog/minimal-node-integration-to-get-you-started-with-stream/">Read the related blog</a>
</p>

## 📝 About Stream

You can sign up for a Stream account at our [Get Started](https://getstream.io/chat/get_started/) page.

There are many libraries available both for frontends and backend. Both [Chat SDKs](https://getstream.io/chat/sdk/) and [Feeds SDKs](https://getstream.io/activity-feeds/sdk/) are available.

# Running this code

The directory `server` contains a minimal integration server implementation to get you started with Stream's backend.

This is what you need to do to get started:

- Sign up for a free trial and obtain your API credentials.
- Clone this repository
- Copy the `.env.sample` file to `.env`: `cp .env.sample` `.env`
- Paste your service credentials into the `.env` file
- Move to the `server` directory and install the dependencies by running `yarn install` or `npm install`.
- Run the server from the `server` directory with `yarn start`/`npm run start`.
