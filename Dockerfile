FROM node:18-alpine

WORKDIR /

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 5173 3000

CMD ["npm", "start"]