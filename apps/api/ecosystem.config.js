module.exports = {
  apps: [
    {
      name: '@apps/api',
      script: './dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      error_file: '/dev/null',
      out_file: '/dev/null',
      merge_logs: false,
      log_date_format: false,
      disable_logs: true,
      node_args: '--max-old-space-size=512',
      max_memory_restart: '500M',
    },
  ],
}
