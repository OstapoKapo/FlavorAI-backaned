FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3030

CMD ["sh", "-c", "npx prisma db push && node dist/main.js"]