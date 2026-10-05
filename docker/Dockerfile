FROM node:22-alpine

WORKDIR /app

COPY app/package*.json ./

RUN npm ci --omit=dev

COPY app/server.js ./

ENV PORT=3001
ENV APP_VERSION=1.0.0
ENV ENVIRONMENT=production

USER node

EXPOSE 3001

CMD ["node", "server.js"]
