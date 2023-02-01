FROM node:16.13.1
LABEL version='1.0'
COPY . /app
WORKDIR /app
#Install the dependencies
RUN npm install
CMD [ "npm", "start" ]