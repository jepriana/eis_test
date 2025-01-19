FROM node:lts-bookworm-slim
RUN apt-get update -y && apt-get install -y openssl

# Set the working directory in the container
WORKDIR /app
# Copy package.json and package-lock.json to the working directory 
COPY package*.json ./ 
# Install dependencies 
RUN npm install
# Copy the rest of the application code to the working directory
COPY . .
# Build the Prisma code
RUN npx prisma generate
# Build the TypeScript code
RUN npx tsc
# Expose the port the application will run on
EXPOSE 8080

CMD ["npm", "start"]