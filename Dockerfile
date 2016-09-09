FROM ubuntu:16.04

MAINTAINER dra1n <dra1n86@gmail.com>

# Install docker
RUN \
  apt-get update && \
  apt-get install -yq apt-transport-https && \
  apt-get clean

RUN \
  apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D && \
  echo deb https://apt.dockerproject.org/repo ubuntu-xenial main > /etc/apt/sources.list.d/docker.list && \
  apt-get update && \
  apt-get install -yq docker-engine

# Install docker machine
RUN \
  apt-get install -y curl && \
  curl -L https://github.com/docker/machine/releases/download/v0.7.0/docker-machine-`uname -s`-`uname -m` > /usr/local/bin/docker-machine && \
  chmod +x /usr/local/bin/docker-machine

# Install qstat
RUN \
  apt-get install qstat && \
  ln -s /usr/bin/quakestat /usr/bin/qstat

# Install nodejs
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get install -y nodejs

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

# Make executables visible system wide
RUN npm install -g .

CMD ["npm", "start"]
