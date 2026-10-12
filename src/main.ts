import { NestFactory } from '@nestjs/core';
import { StarwarsModule } from './infrastructure/starwars.module';

async function bootstrap() {
  const app = await NestFactory.create(StarwarsModule,{cors: true});
  // app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Aplicación disponible en: ${await app.getUrl()}`);
}
bootstrap();
