FROM node:16.13.1
LABEL version='1.0'
COPY . /app
WORKDIR /app

EXPOSE 8100
#Install the dependencies
RUN npm install -g ionic
RUN npm install

#Create an optimized version of the webapp
CMD [ "ionic", "serve" ]