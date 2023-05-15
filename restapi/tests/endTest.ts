import { GlobalConfig, ProjectConfig } from "@jest/types/build/Config";
import { MongoDBContainer, StartedMongoDBContainer } from "testcontainers";

module.exports = async function (
	globalConfig: GlobalConfig,
	projectConfig: ProjectConfig
) {
	const container: StartedMongoDBContainer = await new MongoDBContainer()
		.withReuse()
		.start();
	await container.stop();
};
