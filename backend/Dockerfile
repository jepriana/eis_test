FROM node:lts-bookworm-slim
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /app
COPY . .

RUN npm install
RUN npx prisma generate
RUN npx tsc

EXPOSE 8080

ENV PORT=8080
# set hostname to localhost
ENV HOSTNAME="0.0.0.0"

CMD ["node", "dist/app.js"]