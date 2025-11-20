import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { DefaultAzureCredential } from '@azure/identity';
import { ComputeManagementClient } from '@azure/arm-compute';
import { checkAPIKey } from './middlewares/checkAPIKey.js';
import { routes } from './routes/routes.js';
const {
  AZ_SUBSCRIPTION_ID,
  AZ_RESOURCE_GROUP,
  AZ_VM_NAME,
  SERVER_PORT = 3000,
} = process.env;

if (!AZ_SUBSCRIPTION_ID || !AZ_RESOURCE_GROUP || !AZ_VM_NAME) {
  throw new Error('Config da VM faltando no .env');
}

export const credential = new DefaultAzureCredential();
export const computeClient = new ComputeManagementClient(credential, AZ_SUBSCRIPTION_ID);

const app = express();
app.use(cors());

app.use(checkAPIKey)

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-api-key', 'Authorization'],
}));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

routes(app)

const PORT = process.env.PORT || SERVER_PORT || 3000

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
