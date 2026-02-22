FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY server.js ./server.js
RUN mkdir -p /data

ENV NODE_ENV=production
ENV PORT=8787
ENV DB_PATH=/data/upnft.sqlite

EXPOSE 8787

CMD ["node", "server.js"]
