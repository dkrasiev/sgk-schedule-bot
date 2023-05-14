module.exports = {
  apps: [
    {
      name: "sgk-schedule-bot",
      script: "build/bundle.js",
      env: {
        NODE_ENV: "production",
      },
    },
    // {
    //   name: "sgk-schedule-bot:schedule-checker",
    //   script: "build/bundle.js",
    //   env: {
    //     NODE_ENV: "production",
    //     BOT_MODE: "schedule-checker",
    //   },
    // },
  ],
};
