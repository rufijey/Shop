FROM node

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY . .

CMD ["npm", "start"]

#FROM node:18 as build
#
#WORKDIR /app
#COPY package.json ./
#COPY package-lock.json ./
#RUN npm install
#
#COPY . .
#
#RUN npm run build
#FROM nginx:1.23-alpine
#
#COPY --from=build /app/build /usr/share/nginx/html
#
#EXPOSE 80
#
#CMD ["nginx", "-g", "daemon off;"]
