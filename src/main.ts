import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envObjStart } from './config/envsub.config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  await envObjStart();
  const app = await NestFactory.create(AppModule);
  await app.init();
  const configService = app.get(ConfigService);
  const user = configService.get('rabbitmq.user');
  const password = configService.get('rabbitmq.password');
  const host = configService.get('rabbitmq.host');
  const queueName = configService.get('rabbitmq.queuename');
  await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${user}:${password}@${host}`],
      queue: queueName,
      noAck: false,
      queueOptions: {
        durable: true,
      },
    },
  });
  app.startAllMicroservices();
  await app.listen(configService.get('http.port'));
  console.log(
    `🚀 User service running on port ${configService.get('http.port')}`,
  );
}
bootstrap();
