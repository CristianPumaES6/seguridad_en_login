
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve Static Files
  app.useStaticAssets(join(process.cwd(), 'dir_perfildate'), {
    prefix: '/uploads/profile/',
  });

  // Security
  app.use(helmet({
    crossOriginResourcePolicy: false, // Permite que Angular cargue las imágenes
  }));
  app.enableCors({
    origin: '*', // Restrict this in production!
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api/v1');

  await app.listen(3000);
  console.log('Server running on http://localhost:3000/api/v1');
}
bootstrap();
