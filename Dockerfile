FROM ghcr.io/aura-nw/safe-react-base:1.0 as build

WORKDIR /app
# COPY package.json ./

# COPY yarn.lock ./

COPY . .
RUN yarn cache clean
RUN yarn install

RUN yarn run build


FROM nginx:stable-alpine

COPY --from=build /app/build /app

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
