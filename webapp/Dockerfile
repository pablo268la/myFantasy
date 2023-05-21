FROM node:16.13.1
COPY . /app
WORKDIR /app

EXPOSE 8100
RUN npm install -g ionic --ignore-scripts
RUN npm install --ignore-scripts

CMD [ "ionic", "serve" ]