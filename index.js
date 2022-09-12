import express from 'express';
import cors from 'cors';
import participantRouter from './routers.authController.js'
import extractRouter from './routers.extractControler.js'

const server = express();
server.use(cors());
server.use(express.json());
server.use(participantRouter);
server.use(extractRouter);



server.listen(5000, ()=> console.log('listen on port 5000'));