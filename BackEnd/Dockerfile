FROM node:18.14-slim

WORKDIR /app

RUN apt-get update && apt-get install -y xdg-utils
COPY tsconfig.json ./
COPY package.json package-lock.json* ./
COPY .env ./.env
RUN npm install

COPY . .
COPY ./prisma ./prisma
COPY script.sh ./
RUN chmod +x script.sh
CMD ["sh", "./script.sh"]