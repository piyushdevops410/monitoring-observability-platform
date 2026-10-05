const express = require("express");
const client = require("prom-client");

const app = express();

const PORT = process.env.PORT || 3001;
const APP_VERSION = process.env.APP_VERSION || "1.0.0";
const ENVIRONMENT = process.env.ENVIRONMENT || "development";

client.collectDefaultMetrics();

const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

const appInfo = new client.Gauge({
  name: "application_info",
  help: "Application information",
  labelNames: ["version", "environment"],
});

appInfo.set(
  {
    version: APP_VERSION,
    environment: ENVIRONMENT,
  },
  1
);

app.get("/", (req, res) => {
  httpRequestsTotal.inc({
    method: req.method,
    route: "/",
    status_code: 200,
  });

  res.json({
    application: "Monitoring & Observability Platform",
    version: APP_VERSION,
    environment: ENVIRONMENT,
    endpoints: ["/", "/health", "/metrics"],
  });
});

app.get("/health", (req, res) => {
  httpRequestsTotal.inc({
    method: req.method,
    route: "/health",
    status_code: 200,
  });

  res.status(200).json({
    status: "healthy",
    application: "monitoring-demo-app",
    version: APP_VERSION,
    environment: ENVIRONMENT,
  });
});

app.get("/metrics", async (req, res) => {
  httpRequestsTotal.inc({
    method: req.method,
    route: "/metrics",
    status_code: 200,
  });

  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

app.use((req, res) => {
  httpRequestsTotal.inc({
    method: req.method,
    route: "unknown",
    status_code: 404,
  });

  res.status(404).json({
    error: "Not Found",
  });
});

app.listen(PORT, () => {
  console.log(
    `Monitoring demo app running on port ${PORT} (${ENVIRONMENT})`
  );
});
