const amqplib = require('amqplib');

(async () => {
  const queue = 'tasks';
  const conn = await amqplib.connect('amqp://localhost');

  const ch2 = await conn.createChannel();

  let numberMsg = 0
  setInterval(() => {
    numberMsg += 1;
    ch2.sendToQueue(queue, Buffer.from(`something to do ${numberMsg}`));
  }, 1000);
})();