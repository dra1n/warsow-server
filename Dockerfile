FROM docker:dind

MAINTAINER dra1n <dra1n86@gmail.com>

RUN set -x && apk add --no-cache --virtual curl && \
    curl -L https://github.com/docker/machine/releases/download/v0.8.0/docker-machine-Linux-x86_64 >/usr/local/bin/docker-machine && \
    chmod +x /usr/local/bin/docker-machine && \
    curl -L https://github.com/yamamoto-febc/docker-machine-sakuracloud/releases/download/v0.0.13/docker-machine-driver-sakuracloud-Linux-x86_64 >/usr/local/bin/docker-machine-driver-sakuracloud && \
    chmod +x /usr/local/bin/docker-machine-driver-sakuracloud 

ADD scripts /usr/local/bin

CMD ["/bin/sh"]

#ENTRYPOINT ["/usr/local/bin/docker-machine"]
#CMD ["--help"]
