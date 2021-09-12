import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Skin } from './skin/interfaces/skin.interface';
import { SkinService } from './skin/skin.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  app.enableShutdownHooks();

  const logger = new Logger();

  const skinService = app.get(SkinService);

  logger.log('Getting skins...');

  const skins = await skinService.getSkins();

  skins.sort(function (a, b) {
    return b.id - a.id;
  });

  const deduplicate: { [key: string]: Skin } = {};

  for (let i = 0; i < skins.length; i++) {
    const skin = skins[i];
    deduplicate[skin.name] = skin;
  }

  const deduplicated = Object.values(deduplicate);

  logger.log('Saving ' + deduplicated.length + ' skin(s)...');

  await skinService.saveSkins(deduplicated);

  logger.log('Done saving skins');

  await app.close();
}
bootstrap();
