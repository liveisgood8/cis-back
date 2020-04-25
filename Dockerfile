FROM node:13-alpine as builder

# Build back-end
WORKDIR /usr/src/qcrm-app-back
COPY package*.json ./
RUN apk add gcc make libc-dev python g++
RUN npm ci
COPY tsconfig.json .
COPY src src
COPY tsoa.json .
RUN npm run build

# Build front-end
WORKDIR /usr/src/qcrm-app-front
COPY deps/cis-front .
RUN npm ci
RUN npm run build

# Make server image
FROM node:13-alpine
WORKDIR /usr/src/qcrm-app
ENV NODE_ENV=production
COPY public public
COPY package*.json ./
COPY --from=builder /usr/src/qcrm-app-front/build ./public
COPY --from=builder /usr/src/qcrm-app-back/dist/ dist/
COPY --from=builder /usr/src/qcrm-app-back/swagger.json .
RUN npm ci --only=production
EXPOSE 8080
ENTRYPOINT [ "node", "dist/src/app.js" ]