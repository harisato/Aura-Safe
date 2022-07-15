FROM node:16 as build

RUN apt-get update && apt-get install -y libusb-1.0-0 libusb-1.0-0-dev libudev-dev
CMD ["tail", "-f", "/dev/null;"]