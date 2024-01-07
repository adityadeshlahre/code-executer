FROM alpine:latest

WORKDIR /code-exec

COPY . .

RUN apk --update add sudo g++ openjdk11 nodejs npm && \
    adduser -D docker && \
    echo "docker:docker" | chpasswd && \
    adduser docker sudo && \
    echo "docker ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers && \
    chmod +x /code-exec/run.sh

USER docker

ENTRYPOINT [ "./run.sh" ]
