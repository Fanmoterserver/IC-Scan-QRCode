// ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: 'ic-scan-qrcode',
      script: './build/bin/server.js',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      env: {
        TZ: 'UTC',
        PORT: 3339,
        HOST: '0.0.0.0',
        LOG_LEVEL: 'info',
        APP_KEY: '',
        NODE_ENV: 'production',
        SESSION_DRIVER: 'cookie',

        DB_CONNECTION: 'mysql',
        DB_HOST: '127.0.0.1',
        DB_PORT: 3306,
        DB_USER: 'root',
        DB_PASSWORD: '',
        DB_DATABASE: 'ic_scan_qrcode',
      },
    },
  ],
}
