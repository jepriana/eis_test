FROM node:lts-bookworm-slim
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY build .
CMD ["npm", "start"]