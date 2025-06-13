FROM ubuntu:20.04@sha256:8feb4d8ca5354def3d8fce243717141ce31e2c428701f6682bd2fafe15388214

# Avoid interactive prompt during tzdata setup
ENV DEBIAN_FRONTEND=noninteractive

# Install build tools and glibc 2.31 (default in Ubuntu 20.04)
RUN apt-get update && \
    apt-get install -y build-essential gcc g++ make libc6-dev && \
    apt-get clean

# Create a user (optional, but safer than root)
RUN useradd -ms /bin/bash builder
USER builder
WORKDIR /home/builder/src

# Entrypoint: allow passing commands like `make`
ENTRYPOINT ["/bin/bash"]