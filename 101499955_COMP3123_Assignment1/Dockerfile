#backend Dockerfile
FROM node:18-alpine

#Create app directory
WORKDIR /app

#Install dependencies
COPY package*.json ./
RUN npm install --only=production

#Copy the rest of the code
COPY . .

#Environment variables 
ENV PORT=3000

EXPOSE 3000

CMD ["node", "server.js"]
