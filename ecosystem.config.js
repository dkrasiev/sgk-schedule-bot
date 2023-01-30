module.exports = {
  apps: [
    {
      name: "sgk-schedule-bot",
      script: "dist/app.js",
      cwd: "/root/sgk-schedule-bot",
      env: {
        NODE_ENV: "production",
      },
      post_update: ["npm install", "npm run build"],
    },
    {
      name: "sgk-schedule-bot:schedule-checker",
      script: "dist/schedule-checker.js",
      cwd: "/root/sgk-schedule-bot",
      env: {
        NODE_ENV: "production",
      },
      post_update: ["npm install", "npm run build"],
    },
  ],
};
