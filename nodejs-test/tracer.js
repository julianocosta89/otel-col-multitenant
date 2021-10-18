"use strict";

const opentelemetry = require("@opentelemetry/sdk-node");
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { CollectorTraceExporter } = require("@opentelemetry/exporter-collector-proto");

const x_tenant = process.env.X_TENANT;

const OTLPoptions = {
    url: "http://otel-collector:4318/v1/trace",
    headers: {
        "X-Tenant": x_tenant
    },
};

const collectorExporter = new CollectorTraceExporter(OTLPoptions);

const sdk = new opentelemetry.NodeSDK({
    traceExporter: collectorExporter,
    instrumentations: [getNodeAutoInstrumentations()]
});

sdk.start()