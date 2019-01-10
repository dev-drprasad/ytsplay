FROM node:lts-jessie

WORKDIR /app
ENV NODE_ENV=production

EXPOSE 8080

COPY package.json .

RUN yarn

COPY . .

RUN yarn build --production

CMD [ "node", "server.js" ]
