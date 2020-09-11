FROM node:14

WORKDIR /app

COPY . .

RUN cd src && npm install --production

EXPOSE 3001

CMD [ "npm", "run", "start-server" ]