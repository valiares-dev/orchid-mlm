import { NestFactory } from '@nestjs/core';
import { VersioningType, ValidationPipe } from '@nestjs/common';
import { AppModule, ObserveInstrument } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  app.enableCors();
  app.setGlobalPrefix('api'); // endpoint prefix
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  )

  // app versioning - redirections to version 1 api 
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  })

  const port = process.env.PORT ?? 3001

  await app.listen(port);
  console.log(`API Running at port ${port}`)
}
void bootstrap();
