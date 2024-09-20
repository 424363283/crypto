module.exports = {
  apps: [
    {
      name: 'yemx-next',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        NODE_TLS_REJECT_UNAUTHORIZED: '0',
        PORT: 80
      },
      env_production: {
        PORT: 80,
        NODE_ENV: 'production',
        NODE_TLS_REJECT_UNAUTHORIZED: '0'
      }
    }
  ]
};
