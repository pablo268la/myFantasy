FROM node:16.13.1
COPY . /app
WORKDIR /app


ARG REACT_APP_API_URI='18.196.78.254'

EXPOSE 8100
RUN npm install --ignore-scripts -g ionic 
RUN npm install --ignore-scripts

CMD [ "ionic", "serve" ]