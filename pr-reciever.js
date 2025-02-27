const amqplib = require('amqplib');

async function connectRabbitMQ(queue) {
  const connection = await amqplib.connect('amqp://guest:guest@localhost:5672');
  const channel = await connection.createChannel();
  await channel.assertQueue(queue, { durable: true });
  return channel;
}

async function main(queue){
  const channel = await connectRabbitMQ(queue);

  channel.prefetch(1);

  await channel.consume(queue, async (msg) => {
    const message = msg.content.toString();
    console.log(`Mensagem recebida: ${message}`);
    channel.ack(msg);
  })
}

main('fila_um')
  .then(() => console.log('Iniciado com sucesso'))
  .catch((error) => console.error('Erro ao iniciar:', error.message));

