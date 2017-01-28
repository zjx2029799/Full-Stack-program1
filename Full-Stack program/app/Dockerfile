FROM node:6.3.1

# when using docker, it is no difference between node and nodemon unless you make the docker as volume
# install the nodemon anywhere before start the server.
RUN npm install -g nodemon

# RUN npm install -g yarnpkg

RUN mkdir -p /tiny

WORKDIR /tiny

ADD . /tiny

RUN cd /tiny && npm install

EXPOSE 3000

CMD ["nodemon", "/tiny/server.js"]