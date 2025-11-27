const { PORT } = require('./config');
const { connectDb } = require('./db');
const app = require('./app');

async function bootstrap() {
  try {
    await connectDb();

    app.listen(PORT, () => {
      console.log(`API server ready on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
}

bootstrap();

