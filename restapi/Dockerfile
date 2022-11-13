FROM nikolaik/python-nodejs:latest
LABEL org.opencontainers.image.source https://github.com/pglez82/ASW2122_0
COPY . /app
WORKDIR /app

RUN npm install

EXPOSE 5000

ENV NODE_ENV MONGO_DB_URI
#ENV MONGO_DB_URI=$MONGO_DB_URI

CMD [ "npm", "start" ]