FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV NODE_OPTIONS=--max-old-space-size=3500

EXPOSE 4000

CMD ["npx", "ts-node-dev", "--transpile-only", "--respawn", "src/app.ts"]
