import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  app.enableCors();
  app.setGlobalPrefix('api'); // endpoint prefix 

  const port = process.env.PORT ?? 3001

  await app.listen(port);
  console.log(`API Running at port ${port}`)
}
void bootstrap();
