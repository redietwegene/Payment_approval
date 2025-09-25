import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerJsonPath = path.join(__dirname, 'swagger.json');
const swaggerDoc = JSON.parse(fs.readFileSync(swaggerJsonPath, 'utf8'));

import authRoutes from './routes/auth.js';
import paymentRoutes from './routes/payments.js';

const app = express();

app.use(bodyParser.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use('/auth', authRoutes);
app.use('/payments', paymentRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal error' });
});

export default app;
