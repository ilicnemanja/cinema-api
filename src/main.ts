import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties not in the DTO
      forbidNonWhitelisted: true, // Throw errors for extra properties
      transform: true, // Automatically transform query params to their defined types
    }),
  );

  // set cors options
  // app.enableCors({
  //   origin: ['http://localhost:3000'],
  // });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
