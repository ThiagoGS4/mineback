import { getPowerState } from '../repositories/azureRepository.js';

export default async function checkStateVM(req, res, next) {
  try {
  const status = await getPowerState();
  if (status !== 'VM running') {
    return res.status(400).json({ error: 'VM não está ligada.' });
  }
  next();
   } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Falha ao checar status da VM.' });
  }
}
