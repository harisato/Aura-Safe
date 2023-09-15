FROM node:14 as build

# Grab needed environment variables from .env.example
ENV REACT_APP_ENV=production

RUN apt-get update \
  && apt-get install -y libusb-1.0-0 libusb-1.0-0-dev libudev-dev \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

FROM nginx:stable-alpine

COPY --from=build /app/build /app

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]