import { Express } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { version } from "../package.json";

const options: swaggerJsdoc.Options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "REST API",
			version,
		},
		components: {},
	},
	apis: ["./routes/**.ts", "./model/**.ts"],
};

const swaggerSpec = swaggerJsdoc(options);
console.log(swaggerSpec);

function swaggerDocs(app: Express, port: number) {
	app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
	app.get("docs.json", (req, res) => {
		res.setHeader("Content-Type", "application/json");
		res.send(swaggerSpec);
	});

	console.log(`Swagger docs available at http://localhost:${port}/docs`);
}

export default swaggerDocs;
