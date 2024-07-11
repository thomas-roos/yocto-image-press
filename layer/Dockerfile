FROM public.ecr.aws/lts/ubuntu:22.04_stable

# non-interactive install
ENV DEBIAN_FRONTEND=noninteractive

# Install required packages
RUN apt-get update && \
    apt-get install -y python3-pip python3-dev \
    gawk wget git diffstat unzip texinfo gcc build-essential chrpath socat cpio python3 python3-pip python3-pexpect xz-utils debianutils iputils-ping python3-git python3-jinja2 python3-subunit zstd liblz4-tool file locales libacl1 \
    parted \
    findutils

# /asset must exist and not be empty
WORKDIR /asset

RUN git clone git://git.yoctoproject.org/poky --depth=1  -b kirkstone /asset/poky

# Install Python dependencies
COPY requirements.txt .
RUN pip3 install -r requirements.txt -t /asset/python
