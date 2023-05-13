export default {
	rootDir: "./../",
	transform: {
		"^.+\\.tsx?$": "ts-jest",
	},
	collectCoverage: true,
	collectCoverageFrom: ["controladores/*Controller.ts"],
	testTimeout: 20000,
};
