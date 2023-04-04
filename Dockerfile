FROM keymetrics/pm2

# Bundle APP files
COPY . .

# Install app dependencies
RUN npm install --production

# Show current folder structure in logs
RUN ls -al -R

CMD [ "pm2-runtime", "start", "pm2.json", "--env", "production" ]