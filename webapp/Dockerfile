FROM --platform=linux/amd64 node:16.13.1
COPY . /app
WORKDIR /app

ARG REACT_APP_API_URI='localhost:5000/'
ENV REACT_APP_API_URI=$REACT_APP_API_URI

EXPOSE 8100
RUN npm install --ignore-scripts -g ionic 
RUN npm install --ignore-scripts

CMD [ "ionic", "serve" ]