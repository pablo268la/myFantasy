export default {
	rootDir: "./../",
	transform: {
		"^.+\\.tsx?$": "ts-jest",
	},
	collectCoverage: true,
	collectCoverageFrom: ["controladores/*Controller.ts"],
	globalSetup: "./tests/startTest.ts",
	globalTeardown: "./tests/endTest.ts",
	testTimeout: 20000,
};
