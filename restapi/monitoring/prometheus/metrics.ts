import express from "express";
import client from "prom-client";

const app = express();

export const restResponseTimeHistogram = new client.Histogram({
	name: "rest_response_time_seconds",
	help: "Response time of rest endpoints",
	labelNames: ["method", "route", "status_code"],
	buckets: [0.1, 0.2, 0.5, 1, 2, 5],
});

export const restResponseTimeSummary = new client.Summary({
	name: "rest_response_time_summary_seconds",
	help: "Response time of rest endpoints",
	labelNames: ["method", "route", "status_code"],
	percentiles: [0.5, 0.9, 0.99],
});
