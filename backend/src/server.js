const { PORT } = require('./config');
const { ensureStore } = require('./store');
const app = require('./app');

async function bootstrap() {
  await ensureStore();

  app.listen(PORT, () => {
    console.log(`API server ready on http://localhost:${PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});

