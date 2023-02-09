FROM node:16.13.1
LABEL org.opencontainers.image.source https://github.com/pglez82/ASW2122_0
COPY . /app
WORKDIR /app

#RUN apt-get update || : && apt-get install python3 -y
#RUN python -m pip install requests
#RUN python -m pip install bs4
RUN npm install

EXPOSE 5000

ARG MONGO_DB_URI='localhost:5000/'
ENV MONGO_DB_URI=$MONGO_DB_URI

CMD [ "npm", "start" ]
