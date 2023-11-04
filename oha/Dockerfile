# Dockerfile is used for p0ntan/local-oha:1.0 but is pulled remote. This is just the code for the container
FROM ubuntu:20.04

RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    gnupg \
    curl \
 && echo "deb [signed-by=/usr/share/keyrings/azlux-archive-keyring.gpg] http://packages.azlux.fr/debian/ stable main" | tee /etc/apt/sources.list.d/azlux.list \
 && wget -O /usr/share/keyrings/azlux-archive-keyring.gpg https://azlux.fr/repo.gpg \
 && apt-get update \
 && apt-get install -y oha \

 # Clean up
 && apt-get purge -y --auto-remove wget \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*
