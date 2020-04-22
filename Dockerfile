FROM node:13-alpine as builder
WORKDIR /usr/src/qcrm-app
COPY package*.json ./
RUN apk add gcc make libc-dev python g++
RUN npm ci
COPY tsconfig.json .
COPY src src
COPY tsoa.json .
RUN npm run build

FROM node:13-alpine
WORKDIR /usr/src/qcrm-app
ENV NODE_ENV=production
COPY --from=builder /usr/src/qcrm-app/dist/ dist/
COPY --from=builder /usr/src/qcrm-app/swagger.json .
COPY package*.json ./
COPY public public
RUN npm ci --only=production
EXPOSE 8080
ENTRYPOINT [ "node", "dist/src/app.js" ]