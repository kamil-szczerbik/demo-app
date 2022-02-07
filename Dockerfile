# pull the base image
FROM node:lts-alpine3.14

# set the working directory
WORKDIR /app

# install app dependencies
COPY ./client/package.json ./

COPY ./client/package-lock.json ./

RUN npm install

# copy app

COPY ./client ./

# start app

CMD ["npm", "start"]