FROM node:16-alpine as build
# RUN apt-get update && apt-get install -y libusb-1.0-0 libusb-1.0-0-dev libudev-dev

WORKDIR /app
# COPY package.json ./

# COPY yarn.lock ./

COPY . .
RUN yarn cache clean
RUN yarn install --frozen-lockfile

RUN yarn run build


FROM nginx:stable-alpine

COPY --from=build /app/build /app

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
