import db from './db.js';
import dayjs from 'dayjs';
import joi from 'joi';

const nomeSchema = joi.object({
    valor: joi.string().required(),
    descricao: joi.string().required(),
});

async function novaEntrada (req, res){
    const token = req.headers.authorization?.replace('Bearer ', '');
   
    const validation = nomeSchema.validate(req.body);
    if(validation.error){
        return res.status(422).send(validation.error.message);
    }
    const { valor, descricao } = req.body;

    try {
        const user = await db.collection('sessions').find({ 
            token
        }).toArray();

        const saldo  = await db.collection('saldo').find({email: user[0].email}).toArray();

        const novoSaldo = saldo[0].valor+parseFloat(valor);

        await db.collection('registros').insertOne({
            email: user[0].email,
            valor,
            descricao,
            type: "entrada",
            date: dayjs().format('DD/MM'),
            });

        await db.collection('saldo').updateOne({email: user[0].email},{$set:{valor: novoSaldo}})

        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        return res.status(404).send('Usuário não encontrado');
    }
}

async function novaSaida (req, res) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const validation = nomeSchema.validate(req.body);
    if(validation.error){
        return res.status(422).send(validation.error.message);
    }
    const { valor, descricao } = req.body;
    try {
        const user = await db.collection('sessions').find({ 
            token
        }).toArray();
        const saldo  = await db.collection('saldo').find({email: user[0].email}).toArray();
        console.log(saldo[0].valor);
        const novoSaldo = saldo[0].valor-parseFloat(valor);

        await db.collection('registros').insertOne({
            email: user[0].email,
            valor,
            descricao,
            type: "saida",
            date: dayjs().format('DD/MM'),
            });

        await db.collection('saldo').updateOne({email: user[0].email},{$set:{valor: novoSaldo}})

        /* console.log(user) */
        res.status(201).send(user);
    } catch (error) {
        console.log(error);
        return res.status(404).send('Usuário não encontrado');
    }
}

async function extract (req, res) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    try {
        const user = await db.collection('sessions').find({
        }).toArray();

        const retorno = user.find((value) => value.token === token);
        const valor = await db.collection('saldo').find({
            email:retorno.email
        }).toArray();
        console.log(valor);
        if (!retorno){
            return res.status(404).send('Usuário não encontrado');
        }

        console.log(retorno.email);
        const result = await db.collection('registros').find({
            email:retorno.email
        }).toArray();

        let extrato = valor;
        extrato = [ ...extrato, result];

        res.send(extrato);
    } catch (error) {
        console.error(error);
    }
}

export {novaEntrada, novaSaida, extract };