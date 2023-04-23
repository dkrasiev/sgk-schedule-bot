FROM node:18-alpine

# Expose ports needed to use Keymetrics.io
EXPOSE 80 443 43554

# install pm2
RUN npm install pm2 -g
RUN pm2 update

# Install app dependencies
COPY package.json package.json
RUN npm install

# Bundle APP files
COPY . .
RUN npm run build

CMD [ "pm2-runtime", "start", "pm2.json", "--env", "production" ]