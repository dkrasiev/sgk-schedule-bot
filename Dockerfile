FROM node:lts-slim AS build

WORKDIR /app

RUN npm install -g pnpm

# Install app dependencies
COPY . .
RUN pnpm install
RUN pnpm run build


FROM node:lts-slim AS runtime

WORKDIR /app

# Expose ports needed to use Keymetrics.io
EXPOSE 80 443 43554

# pm2
RUN npm install pm2 -g
ENV PM2_PUBLIC_KEY $PM2_PUBLIC_KEY
ENV PM2_SECRET_KEY $PM2_SECRET_KEY

COPY --from=build /app/.env .
COPY --from=build /app/build .
COPY --from=build /app/pm2.json .

CMD [ "pm2-runtime", "start", "pm2.json", "--env", "production" ]