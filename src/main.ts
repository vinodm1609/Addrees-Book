import { LoggerInterceptor } from '../src/interceptors/logger.interceptor';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { MongoErrorFilter } from './filter/mongoError.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Address Book')
    .setDescription('The Address Book API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  app.useGlobalInterceptors(new LoggerInterceptor());

  app.useGlobalFilters(new MongoErrorFilter());

  await app.listen(process.env.PORT);
}
bootstrap();
