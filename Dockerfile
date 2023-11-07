

# get the base node image
FROM node:14-alpine as builder

# set the working dir for container
WORKDIR /frontend

# copy the json file first
COPY ./package.json /frontend

# install npm dependencies
RUN npm install

# copy other project files
COPY . .

ARG ENV
ENV ENV $ENV

RUN npm run build:staging

# Handle Nginx
FROM nginx
ARG ENV
ENV ENV $ENV
COPY --from=builder /frontend/build /usr/share/nginx/html
COPY ./docker/nginx-staging/default.conf /etc/nginx/conf.d/default.conf

