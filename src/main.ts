import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.use(json({ limit: '5mb' }));

  const port = process.env.PORT || 8080;
  app.setGlobalPrefix(`/api/${process.env.API_VERSION}`);
  await app.listen(port, () => console.log(`NotGamp Service: ${port}`));
}
bootstrap();
