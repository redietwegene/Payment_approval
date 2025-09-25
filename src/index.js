import 'dotenv/config';
import app from './app.js';
import { initDb } from './models/db.js';

const PORT = process.env.PORT || 3000;

try {
  await initDb();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
} catch (err) {
  console.error('Failed to initialize DB', err);
  process.exit(1);
}
