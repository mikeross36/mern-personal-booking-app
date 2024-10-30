FROM node:20.9.0-alpine3.18
WORKDIR /Docker_Compose/server
COPY package.json .
RUN npm install
COPY . .
EXPOSE 5000
CMD [ "npm", "start" ]