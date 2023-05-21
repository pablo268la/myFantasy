FROM node:16.13.1
COPY . /app
WORKDIR /app

RUN npm install --ignore-scripts

EXPOSE 5000

ARG MONGO_DB_URI='localhost:5000/'
ENV MONGO_DB_URI=$MONGO_DB_URI

CMD [ "npm", "start" ]
