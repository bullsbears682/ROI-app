module.exports = {
  apps: [{
    name: 'catalyst-roi-api',
    script: 'api/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 3001
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: process.env.PORT || 3001,
      JWT_SECRET: process.env.JWT_SECRET || 'catalyst-roi-production-secret-2025'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};