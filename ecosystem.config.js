module.exports = {
  apps: [
    {
      name: "ms-moveis-sob-medida",
      script: "npm",
      args: "start",
      cwd: "/var/www/ms-moveis-sob-medida",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: "300M",
    },
  ],
};
