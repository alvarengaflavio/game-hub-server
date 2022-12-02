import { NestFactory } from '@nestjs/core';
import { AppModule } from '$/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Enable CORS
  const app = await NestFactory.create(AppModule, { cors: true });

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Game-Hub')
    .setDescription('API para um sistema de Game Hub')
    .setVersion('1.0.0')
    .addTag('status')
    .addTag('auth')
    .addTag('user')
    .addTag('profile')
    // .addTag('game')
    // .addTag('genres')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // http://localhost:3333/api

  await app.listen(3333);
}
bootstrap();

// const app = await NestFactory.create(AppModule, { cors: true })
