FROM node:16.13.1
COPY . /app
WORKDIR /app

EXPOSE 8100
RUN npm install --ignore-scripts -g ionic 
RUN npm install --ignore-scripts

CMD [ "ionic", "serve" ]