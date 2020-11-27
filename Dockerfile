FROM node:12.18.4

WORKDIR /usr/src/facerecognition-api

COPY ./ ./

RUN npm install

CMD ["/bin/bash"]

