FROM node:14.18.0 as builder
WORKDIR /usr/app
COPY package*.json ./
RUN npm install


FROM node:14.18.0-alpine
WORKDIR /usr/app
COPY --from=builder /usr/app ./
COPY . .
EXPOSE 8080
CMD [ "node", "--require", "./tracer.js", "server.js" ]
