import client from "prom-client";

export const restResponseTimeHistogram = new client.Histogram({
	name: "api_response_time",
	help: "Response time of rest endpoints",
	labelNames: ["method", "route", "status_code"],
	buckets: [0.1, 0.2, 0.5, 1, 2, 5],
});

export const restResponseTimeSummary = new client.Summary({
	name: "api_summary_responses",
	help: "Response time of rest endpoints",
	labelNames: ["method", "route", "status_code"],
	percentiles: [0.5, 0.9, 0.99],
});
