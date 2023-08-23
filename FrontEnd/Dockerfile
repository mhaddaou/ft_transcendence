FROM node:18.14-slim

WORKDIR /app

RUN apt-get update -y && apt-get upgrade -y

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
