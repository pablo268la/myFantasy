import { MongoDBContainer, StartedMongoDBContainer } from "testcontainers";

const mongoose = require("mongoose");

module.exports = async function () {
	const container: StartedMongoDBContainer = await new MongoDBContainer()
		.withReuse()
		.start();

	await mongoose.connection.close();

	await container.stop();
};
