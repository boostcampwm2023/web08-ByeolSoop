FROM node:20.10.0-alpine3.18

LABEL author jeongmin

WORKDIR /usr/src/app

ENV LANG=ko_KR.UTF-8 \
    LANGUAGE=ko_KR.UTF-8

RUN apk add --update git && \
	apk --no-cache add tzdata && \
    cp /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    echo "Asia/Seoul" > /etc/timezone

RUN git clone https://github.com/boostcampwm2023/web08-ByeolSoop . \
 	&& cd FE && npm install --force

WORKDIR /usr/src/app/FE

RUN find ./src/ -type f |xargs sed -i 's/223.130.129.145:3005/223.130.129.145\/api/g'

CMD [ "npm", "run", "start" ]
