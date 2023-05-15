import { MongoDBContainer, StartedMongoDBContainer } from "testcontainers";

module.exports = async function () {
	const container: StartedMongoDBContainer = await new MongoDBContainer()
		.withReuse()
		.start();
	await container.stop();
};
