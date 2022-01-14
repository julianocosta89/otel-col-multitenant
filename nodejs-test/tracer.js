"use strict";

const opentelemetry = require('@opentelemetry/api');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const { OTLPTraceExporter  } = require("@opentelemetry/exporter-trace-otlp-grpc");
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

const tenant = process.env.TENANT;

module.exports = (serviceName) => {
    let provider =  new NodeTracerProvider({
        resource: new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: "nodejs_multitenant",
            [SemanticResourceAttributes.SERVICE_VERSION]: "1.0.0",
            "tenant": tenant
        }),
    });

    registerInstrumentations({
        tracerProvider: provider,
        instrumentations: [
            HttpInstrumentation,
            ExpressInstrumentation,
        ],
    });

    const OTLPoptions = {
        url: "http://otel-collector:4317",
    };

    let traceExporter = new OTLPTraceExporter(OTLPoptions);

    provider.addSpanProcessor(new SimpleSpanProcessor(traceExporter));

    provider.register();

    return opentelemetry.trace.getTracer('multitenant-example');
};
