FROM node:16 as build

WORKDIR /app

COPY . .
RUN yarn cache clean
RUN yarn install --network-concurrency 1

RUN yarn run build


FROM nginx:stable-alpine

COPY --from=build /app/build /app

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
