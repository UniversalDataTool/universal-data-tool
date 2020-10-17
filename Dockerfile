FROM node:12

WORKDIR /usr/src/app

RUN npm install -g serve

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:web:static"]
