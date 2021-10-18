## This is a study sample  
After deploying the app, it will be available at [`http://localhost:8080`](http://localhost:8080).  
Access it to generate some spans.  

### How to deploy
**The following instructions assume you have docker installed.**
- Auto:
    - Simply run `./start.sh`
    - The start script will build and run the nodejs sample, the collector and Jaeger in a created docker network called `multitenant`.
    

- Manual:
    - Both folders have a Dockerfile inside, to build the images, run the following:
        - `docker build -t nodetest nodejs-test/`
        - `docker build -t otel-collector otel-collector/`
    - Now we need to create a docker network:
        - `docker network create multitenant`
    - And now we can run the containers in this network:
        ```shell
        docker run -d --rm --name jaeger --network multitenant -e COLLECTOR_ZIPKIN_HOST_PORT=:9411 -p 5775:5775/udp -p 6831:6831/udp -p 6832:6832/udp -p 5778:5778 -p 16686:16686 -p 14268:14268 -p 14250:14250 -p 9411:9411 jaegertracing/all-in-one:1.27
        
        docker run -d --rm --network multitenant --name otel-collector otel-collector

        docker run -d --rm -p 8080:8080 --network multitenant -e X_TENANT=ecorp --name nodetest nodetest
        ```
        - Note that we are passing the `X_TENANT` as environment variable to the nodetest container, and that should be either `acme` or `ecorp`.
            - `acme` to export spans to Jaeger.
            - `ecorp` to export spans to Logging.
            - Unfortunately that's not working, and only the [`default_exporters`](otel-collector/conf.yml#L10) is considered.  

### How to clean up  
- To remove all containers and the network, simply run the following commands:
    - `docker kill jaeger nodetest otel-collector`
    - `docker network rm multitenant` 
