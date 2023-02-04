module.exports = {
  apps: [
    {
      name: "sgk-schedule-bot",
      script: "dist/app.js",
      env: {
        NODE_ENV: "production",
      },
      post_update: ["npm install", "npm run build"],
    },
    {
      name: "sgk-schedule-bot:schedule-checker",
      script: "dist/app.js",
      env: {
        NODE_ENV: "production",
        START_SCHEDULE_CHECKER: "true",
      },
      post_update: ["npm install", "npm run build"],
    },
  ],
};
