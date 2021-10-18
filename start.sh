#!/bin/bash

check_network() {
    echo "Checking if multitenant network exists, if not, it will be created."
    for networkName in $(docker network ls --format '{{.Name}}')
    do
        if [ "$networkName" = "multitenant" ]
        then
            return;
        fi
    done

    docker network create multitenant
}

build_docker_images() {
    echo "Building images nodetest and otel-collector"
    docker build -t nodetest nodejs-test/
    docker build -t otel-collector otel-collector/
}

run_containers() {
    echo "Running containers Jaeger, nodetest and otel-collector"
    docker run -d --rm --name jaeger --network multitenant -e COLLECTOR_ZIPKIN_HOST_PORT=:9411 -p 5775:5775/udp -p 6831:6831/udp -p 6832:6832/udp -p 5778:5778 -p 16686:16686 -p 14268:14268 -p 14250:14250 -p 9411:9411 jaegertracing/all-in-one:1.27
    docker run -d --rm -p 8080:8080 --network multitenant -e X_TENANT=ecorp --name nodetest nodetest
    docker run -d --rm --network multitenant --name otel-collector otel-collector
}

check_network
build_docker_images
run_containers