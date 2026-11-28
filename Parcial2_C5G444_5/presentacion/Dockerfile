# Stage 1
FROM node:24 AS angular

WORKDIR /app
COPY ./presentacion/package*.json .
RUN npm install
COPY ./presentacion/. .

RUN npm run build

#Stage 2
FROM nginx:1.27.0-alpine

#FROM php:apache

#/var/www/html

COPY --from=angular /app/dist/presentacion/browser/ /usr/share/nginx/html

EXPOSE 80
