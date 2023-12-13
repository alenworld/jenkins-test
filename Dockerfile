FROM node:16.14-bullseye

# args and env variables
ARG RELEASE_DATE
ENV RELEASE_DATE $RELEASE_DATE

WORKDIR /home/node/app

RUN apt-get update && \
    apt-get install -y \
      postgresql-client-13

COPY package* ./

RUN npm ci

COPY . .

RUN npm run build

ADD ./docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["docker-entrypoint.sh"]
