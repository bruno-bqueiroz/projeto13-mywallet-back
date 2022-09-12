import { novaEntrada, novaSaida, extract } from './extractControler.js';
import express from 'express';

const router = express.Router();

router.post('/registrodeentrada', novaEntrada);

router.post('/registrodesaida', novaSaida);

router.get('/registros', extract);

export default router;