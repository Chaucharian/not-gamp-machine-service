import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'body-parser';
import firebase from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  const configService = app.get(ConfigService);

  app.use(json({ limit: '5mb' }));

  const port = process.env.PORT || 8080;
  app.setGlobalPrefix(`/api/${process.env.API_VERSION}`);

  firebase.initializeApp({
    credential: firebase.credential.cert(configService.get('firebase')),
    databaseURL: 'https://not-gamp-machine.firebaseio.com',
  });

  await app.listen(port, () => console.log(`NotGamp Service: ${port}`));
}
bootstrap();
