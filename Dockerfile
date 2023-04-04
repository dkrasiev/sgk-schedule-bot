FROM keymetrics/pm2

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

CMD [ "pm2", "start", "pm2.js" ]
