# -- Base Image
FROM node:16-alpine as base
WORKDIR /app

# -- Build Dependencies
FROM base AS dependencies
COPY package*.json ./
RUN npm install

# -- Build
FROM dependencies AS build
WORKDIR /app
COPY . .
RUN npm run build

# -- Execute
FROM node:16-alpine
WORKDIR /app
COPY --from=dependencies /app/package.json ./
RUN npm install
COPY --from=build /app/dist ./dist
RUN mkdir ./logs
EXPOSE 3002

CMD ["node", "dist/server.js"]
