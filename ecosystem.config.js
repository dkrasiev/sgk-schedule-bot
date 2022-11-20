module.exports = {
  apps: [
    {
      name: 'sgk-schedule-bot',
      script: 'dist/app.js',
      cwd: '/root/sgk-schedule-lite-bot',
      env: {
      	NODE_ENV: "production",
      },
      post_update: [
      	'npm install', 'npm run build'
      ],
    },
  ],
};
