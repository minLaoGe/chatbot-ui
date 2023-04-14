module.exports = {
    apps: [
        {
            name: 'nextjs-app',
            script: 'npm',
            args: 'start',
            env: {
                NODE_ENV: 'production',
            },
            output: './logs/out.log',
            error: './logs/error.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss',
            merge_logs: true,
            max_memory_restart: '1G',
        },
    ],
};
