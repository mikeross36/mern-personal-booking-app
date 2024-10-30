FROM node:20.9.0-alpine3.18
WORKDIR /Docker_Compose/client
COPY package.json .
RUN npm install
COPY . .
EXPOSE 5173
CMD [ "npm","run","dev" ]