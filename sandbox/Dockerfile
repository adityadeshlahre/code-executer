FROM ubuntu:latest

WORKDIR /code-exec

COPY ./run.sh .

RUN apt-get update && \
    apt-get -y install sudo time g++ default-jdk nodejs npm && \
    useradd -m docker && \
    echo "docker:docker" | chpasswd && \
    adduser docker sudo && \
    echo "docker ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers && \
    chmod +x /code-exec/run.sh

USER docker

CMD ["/code-exec/run.sh"]
