import express from "express";
import client from "prom-client";

const app = express();

export const restResponseTimeHistogram = new client.Histogram({
    name: "rest_response_time_seconds",
    help: "Response time of rest endpoints",
    labelNames: ["method", "route", "status_code"],
    buckets: [0.1, 0.2, 0.5, 1, 2, 5],
});


export function startMertricServer() {

    const collectDefaultMetrics = client.collectDefaultMetrics;
    
    collectDefaultMetrics();

	app.get("/metrics", async (req, res) => {
		res.set("Content-Type", client.register.contentType);
		return res.send(await client.register.metrics());
	});

	app.listen(9100, () => {
		console.log("Metrics server listening to http://localhost:9100");
	});
}
