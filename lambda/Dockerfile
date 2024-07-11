FROM public.ecr.aws/lts/ubuntu:22.04_stable

# Define custom function directory
ARG FUNCTION_DIR="/function"

# Include global arg in this stage of the build
ARG FUNCTION_DIR

# Copy function code
RUN mkdir -p ${FUNCTION_DIR}
COPY lambda_function.py ${FUNCTION_DIR}


# Install required packages
# non-interactive install
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && \
    apt-get install -y python3-pip python3-dev \
    gawk wget git diffstat unzip texinfo gcc build-essential chrpath socat cpio python3 python3-pip python3-pexpect xz-utils debianutils iputils-ping python3-git python3-jinja2 python3-subunit zstd liblz4-tool file locales libacl1 \
    parted \
    findutils \
    python-is-python3

# Install Python dependencies
RUN pip3 install  -t ${FUNCTION_DIR} \
                awslambdaric \
                requests \
                boto3


# required by lambda
RUN ln -sf /usr/bin/python /usr/local/bin/python

# Include global arg in this stage of the build
ARG FUNCTION_DIR

# Set working directory to function root directory
WORKDIR ${FUNCTION_DIR}

# Copy in the built dependencies
# COPY --from=build-image ${FUNCTION_DIR} ${FUNCTION_DIR}

RUN git clone git://git.yoctoproject.org/poky --depth=1  -b kirkstone

# Set runtime interface client as default command for the container runtime
ENTRYPOINT [ "/usr/local/bin/python", "-m", "awslambdaric" ]

# Pass the name of the function handler as an argument to the runtime
CMD [ "lambda_function.handler" ]
