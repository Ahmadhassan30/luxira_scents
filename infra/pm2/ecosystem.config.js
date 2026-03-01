module.exports = {
    apps: [
        {
            name: 'luxira-api',
            script: 'dist/main.js',
            cwd: '/var/www/luxira/apps/api',
            instances: 2,            // 2 workers for a 4GB VPS (leave cores for PgBouncer + Nginx)
            exec_mode: 'cluster',
            env_production: {
                NODE_ENV: 'production',
                PORT: 4000,
            },
            error_file: '/var/log/pm2/luxira-api-error.log',
            out_file: '/var/log/pm2/luxira-api-out.log',
            time: true,
            // Graceful shutdown — wait for in-flight requests to finish
            kill_timeout: 10000,
            wait_ready: true,
            listen_timeout: 15000,
        },
        {
            name: 'luxira-web',
            script: 'node',
            args: 'server.js',
            cwd: '/var/www/luxira/apps/web',
            instances: 2,
            exec_mode: 'cluster',
            env_production: {
                NODE_ENV: 'production',
                PORT: 3000,
                HOSTNAME: '0.0.0.0',
            },
            error_file: '/var/log/pm2/luxira-web-error.log',
            out_file: '/var/log/pm2/luxira-web-out.log',
            time: true,
            kill_timeout: 10000,
            wait_ready: true,
            listen_timeout: 15000,
        },
    ],
};
