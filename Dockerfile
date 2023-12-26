FROM node:18-alpine as deps
WORKDIR /app
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm ci

FROM node:18
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules /app/node_modules
CMD ["node","index.js"]