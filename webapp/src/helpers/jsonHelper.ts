const fs = require("fs");

export function openJSON(fileName: string) {
	fs.readFile("./portero.json", "utf8", (error: any, data: any) => {
		if (error) {
			console.log(error);
			return;
		}
		console.log(JSON.parse(data));
	});
}
