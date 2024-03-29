FROM node:19-alpine3.16
RUN mkdir -p /home/node/app/Taxi_Industry/node_modules && chown -R node:node /home/node/app/Taxi_Industry
WORKDIR /home/node/app/Taxi_Industry
COPY --chown=node:node package*.json ./
USER node
RUN npm install
COPY --chown=node:node . .
EXPOSE 3000
CMD [ "node", "server.js" ]
