import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
	appId: "com.example.app",
	appName: "Headline Coach",
	webDir: "build",
	bundledWebRuntime: false,
	server: {
		cleartext: true,
	},
};

export default config;
