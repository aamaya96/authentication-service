FROM node:10-alpine as build

WORKDIR /srv

RUN apk add --update --no-cache \
python \
make \
g++

COPY package.json .

RUN npm install

FROM node:11.10.0-alpine

EXPOSE 3000

WORKDIR /srv

COPY --from=build /srv/node_modules /srv/node_modules

COPY --from=build /srv/package.json /srv/package.json

COPY src /srv/src/

CMD [ "npm", "run", "start" ]