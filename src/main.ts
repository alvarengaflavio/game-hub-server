import { NestFactory } from '@nestjs/core';
import { AppModule } from '$/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Xbox-Live')
    .setDescription('The Xbox-Live API Clone')
    .setVersion('1.0.0')
    .addTag('status')
    .addTag('user')
    .addTag('profile')
    .addTag('game')
    .addTag('genres')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // http://localhost:3333/api

  await app.listen(3333);
}
bootstrap();
