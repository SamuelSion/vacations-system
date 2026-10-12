FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# --no-open: there is no browser inside a container (vite.config.ts opens one for local npm start)
CMD ["npx", "vite", "--host", "0.0.0.0", "--port", "5173", "--no-open"]
