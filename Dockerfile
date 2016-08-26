FROM docker:dind

MAINTAINER dra1n <dra1n86@gmail.com>

RUN set -x && apk add --no-cache --virtual curl && \
  curl -L https://github.com/docker/machine/releases/download/v0.8.0/docker-machine-Linux-x86_64 >/usr/local/bin/docker-machine && \
  chmod +x /usr/local/bin/docker-machine && \
  curl -L https://github.com/yamamoto-febc/docker-machine-sakuracloud/releases/download/v0.0.13/docker-machine-driver-sakuracloud-Linux-x86_64 >/usr/local/bin/docker-machine-driver-sakuracloud && \
  chmod +x /usr/local/bin/docker-machine-driver-sakuracloud

RUN set -x && \
  apk add --no-cache unzip automake autoconf alpine-sdk && \
  cd /tmp && \
  curl -L https://sourceforge.net/projects/qstat/files/qstat/qstat-2.11/qstat-2.11.tar.gz/download > qstat.tar.gz && \
  tar -zxf qstat.tar.gz && \
  cd qstat-2.11 && \
  ./configure && \
  make && \
  make install && \
  make clean

ENV NODE_VERSION=v6.4.0 NPM_VERSION=3

# For base builds
# ENV CONFIG_FLAGS="--without-npm" RM_DIRS=/usr/include
# ENV CONFIG_FLAGS="--fully-static --without-npm" DEL_PKGS="libgcc libstdc++" RM_DIRS=/usr/include

RUN apk add --no-cache curl make gcc g++ python linux-headers paxctl libgcc libstdc++ gnupg && \
  gpg --keyserver ha.pool.sks-keyservers.net --recv-keys \
    9554F04D7259F04124DE6B476D5A82AC7E37093B \
    94AE36675C464D64BAFA68DD7434390BDBE9B9C5 \
    0034A06D9D9B0064CE8ADF6BF1747F4AD2306D93 \
    FD3A5288F042B6850C66B31F09FE44734EB7990E \
    71DCFD284A79C3B38668286BC97EC7A07EDE3FC1 \
    DD8F2338BAE7501E3DD5AC78C273792F7D83545D \
    C4F0DFFF4E8C1A8236409D08E73BC641CC11F4C8 \
    B9AE9905FFD7803F25714661B63B535A4C206CA9 && \
  curl -o node-${NODE_VERSION}.tar.gz -sSL https://nodejs.org/dist/${NODE_VERSION}/node-${NODE_VERSION}.tar.gz && \
  curl -o SHASUMS256.txt.asc -sSL https://nodejs.org/dist/${NODE_VERSION}/SHASUMS256.txt.asc && \
  gpg --verify SHASUMS256.txt.asc && \
  grep node-${NODE_VERSION}.tar.gz SHASUMS256.txt.asc | sha256sum -c - && \
  tar -zxf node-${NODE_VERSION}.tar.gz && \
  cd node-${NODE_VERSION} && \
  export GYP_DEFINES="linux_use_gold_flags=0" && \
  ./configure --prefix=/usr ${CONFIG_FLAGS} && \
  NPROC=$(grep -c ^processor /proc/cpuinfo 2>/dev/null || 1) && \
  make -j${NPROC} -C out mksnapshot BUILDTYPE=Release && \
  paxctl -cm out/Release/mksnapshot && \
  make -j${NPROC} && \
  make install && \
  paxctl -cm /usr/bin/node && \
  cd / && \
  if [ -x /usr/bin/npm ]; then \
    npm install -g npm@${NPM_VERSION} && \
    find /usr/lib/node_modules/npm -name test -o -name .bin -type d | xargs rm -rf; \
  fi && \
  apk del curl make gcc g++ python linux-headers paxctl gnupg ${DEL_PKGS} && \
  rm -rf /etc/ssl /node-${NODE_VERSION}.tar.gz /SHASUMS256.txt.asc /node-${NODE_VERSION} ${RM_DIRS} \
    /usr/share/man /tmp/* /var/cache/apk/* /root/.npm /root/.node-gyp /root/.gnupg \
    /usr/lib/node_modules/npm/man /usr/lib/node_modules/npm/doc /usr/lib/node_modules/npm/html

RUN mkdir -p /etc/ssl/certs/ && update-ca-certificates --fresh

ADD scripts /usr/local/bin

CMD ["/bin/sh"]
