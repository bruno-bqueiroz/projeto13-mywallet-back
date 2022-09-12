import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';
import db from './db.js';
import joi from 'joi';

const nomeSchema = joi.object({
    name: joi.string(),
    email: joi.string().required(),
    password: joi.string().required(),
});

async function createParticipant (req, res) {
    const validation = nomeSchema.validate(req.body);
    if(validation.error){
        return res.status(422).send(validation.error.message);
    }
    const {name, email, password} = req.body;

    const hashPassword = bcrypt.hashSync(password, 10);

    try {
       const temUsuario =  await db.collection('users').findOne({
            email
        });

        if(temUsuario){
            return res.status(409).send('email ja esta em uso');
        }
        await db.collection('users').insertOne({
            name,
            email,
            password: hashPassword,
        });
        await db.collection('saldo').insertOne({email, valor: 0});
        
    } catch (error) {
        console.error(error);
        res.sendStatus(error);
    }
    res.sendStatus(201);
}

async function loginParticipant(req, res) {
    const validation = nomeSchema.validate(req.body);
    
    if(validation.error){
        return res.status(422).send(validation.error.message);
    }
    const { email, password } = req.body;

    try {
        const user = await db.collection('users').findOne({
          email,
        });
        const isValid = bcrypt.compareSync(password, user.password);
  
        if(!user || !isValid) {
          return res.status(404).send('Usuário ou senha não encontrada');
        }
        
        const token = uuid();
        await db.collection('sessions').insertOne({
            email,
			token
        });

        res.status(200).send(token);
  
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
}

export {createParticipant, loginParticipant};