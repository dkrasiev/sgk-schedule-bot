# SGK schedule bot

Telegram bot for getting the schedule of classes of Samara State College

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`BOT_TOKEN` (`BOT_TOKEN_TEST` for development)

`MONGODB_URI` (`mongodb://localhost` by default)

`MONGODB_NAME` (`MONGODB_NAME_TEST` for development, `sgk-schedule-bot` by default)

`REDIS_URI` (`redis://localhost` by default)

## Run Locally

Clone the project

```bash
  git clone https://github.com/dkrasiev/sgk-schedule-bot.git
```

Go to the project directory

```bash
  cd sgk-schedule-bot
```

Install dependencies

```bash
  npm install
```

or (recommended)

```bash
  pnpm install
```

Start the bot

```bash
  npm run dev
```

## Deployment

To deploy this project you can use pm2

```bash
  pm2 start ecosystem.config.js
```

## Running Tests

To run tests, run the following command

```bash
  npm run test
```
