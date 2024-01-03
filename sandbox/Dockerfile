FROM ubuntu:latest

RUN mkdir code-exec
COPY ./run.sh /code-exec

WORKDIR /code-exec

RUN apt-get update && \
apt-get -y install sudo

RUN useradd -m docker && echo "docker:docker" | chpasswd && adduser docker sudo
RUN echo "docker ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

RUN apt-get update && \
    apt-get -y install time g++ default-jdk nodejs npm

RUN chmod +x run.sh

CMD ["./run.sh"]
ENTRYPOINT ["/bin/bash"]
