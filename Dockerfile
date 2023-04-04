FROM node

# install pm2
RUN npm install pm2 -g
RUN pm2 update

# Expose ports needed to use Keymetrics.io
EXPOSE 80 443 43554

# Install app dependencies
COPY package-lock.json package-lock.json
RUN npm ci

# Bundle APP files
COPY . .
RUN npm run build

CMD [ "pm2-runtime", "start", "pm2.json", "--env", "production" ]