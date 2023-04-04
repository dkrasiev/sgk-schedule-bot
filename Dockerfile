FROM node

# install pm2
RUN npm install pm2 -g

# Expose ports needed to use Keymetrics.io
EXPOSE 80 443 43554

# Install app dependencies
COPY package.json package.json
RUN npm install --production

# Bundle APP files
COPY . .

# Show current folder structure in logs
RUN ls -al -R

CMD [ "pm2-runtime", "start", "pm2.json", "--env", "production" ]