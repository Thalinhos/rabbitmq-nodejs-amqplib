const express = require('express');
const amqplib = require('amqplib');
const { exec } = require('child_process');

const app = express();
app.use(express.json());

async function connectRabbitMQ(queue) {
  const connection = await amqplib.connect('amqp://guest:guest@localhost:5672');
  const channel = await connection.createChannel();
  await channel.assertQueue(queue, { durable: true });
  return channel;
}


app.post('/sendMQ', async (req, res) => {
  try {
  const { message } = req.body;

  console.log('recebido: ', message)
  
  const channel = await connectRabbitMQ('fila_um');
  const rabbitMessage = message;
  channel.sendToQueue('fila_um', Buffer.from(rabbitMessage), {persistent: true});

  res.status(200).json({message: "mensagem enviada com sucesso!"})
    
  } catch (error) {
    res.status(400).json({message: "Serviço indisponível."})
  }
  
})


app.listen(3001, () => console.log('API rodando na porta 3001'));