require("dotenv").config();

const { createApp } = require("./app");

const PORT = Number(process.env.PORT) || 5001;

const app = createApp();

const server = app.listen(PORT, () => {
  console.log(`OWOW Playbook AI backend running on http://localhost:${PORT}`);
});

server.on("error", (err) => {
  if (err && err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Try a different PORT in .env.`);
    process.exit(1);
  }

  console.error("Server failed to start:", err);
  process.exit(1);
});

