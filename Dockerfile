FROM node:12.18.1-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
 
COPY app.js controllers joinPost.js models package.json routes constants lib ./src/
CMD ["npm", "start"]