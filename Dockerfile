FROM node:16 as build

RUN apt-get update && apt-get install -y libusb-1.0-0 libusb-1.0-0-dev libudev-dev

WORKDIR /app
COPY . .
# COPY package.json ./

# COPY yarn.lock ./

# COPY  src/logic/contracts/artifacts ./src/logic/contracts/artifacts

RUN yarn install

RUN yarn run build

# EXPOSE 3000

# CMD ["yarn", "start"]

FROM nginx:stable-alpine

COPY --from=build /app/build /app

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
