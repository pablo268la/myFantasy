FROM --platform=linux/amd64 node:16.13.1
COPY . /app
WORKDIR /app

RUN npm install --ignore-scripts

EXPOSE 5000

ARG MONGO_DB_URI='localhost:5000/'
ENV MONGO_DB_URI=$MONGO_DB_URI

ARG JWT_SECRET='secret'
ENV JWT_SECRET=$JWT_SECRET

CMD [ "npm", "start" ]
